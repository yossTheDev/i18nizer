import { Args, Command, Flags } from "@oclif/core";
import chalk from "chalk";
import path from "node:path";
import ora, { Ora } from "ora";

import { generateTranslations, Provider } from "../core/ai/client.js";
import { buildPrompt } from "../core/ai/promt.js";
import { extractTexts } from "../core/ast/extract-text.js";
import { insertUseTranslations } from "../core/ast/insert-user-translations.js";
import { parseFile } from "../core/ast/parse-file.js";
import { replaceTempKeysWithT } from "../core/ast/replace-text-with-text.js";
import { TranslationCache } from "../core/cache/translation-cache.js";
import { Deduplicator } from "../core/deduplication/deduplicator.js";
import { parseAiJson } from "../core/i18n/parse-ai-json.js";
import { saveSourceFile } from "../core/i18n/sace-source-file.js";
import { writeLocaleFiles } from "../core/i18n/write-files.js";

const VALID_PROVIDERS: Provider[] = ["gemini", "huggingface", "openai"];

export default class Extract extends Command {
  static override args = {
    file: Args.string({
      description: "Path to the TSX/JSX file",
      required: true,
    }),
  };
  static override description =
    "🌍 Extract translatable strings from a TSX/JSX file and generate i18n JSON";
  static override flags = {
    locales: Flags.string({
      char: "l",
      default: "en,es",
      description: "Locales to generate",
    }),
    provider: Flags.string({
      char: "p",
      description: "AI provider (gemini | huggingface), optional",
    }),
    "use-ai-keys": Flags.boolean({
      allowNo: true,
      default: true,
      description: "Use AI to generate human-readable keys (default: true)",
    }),
  };

  async run() {
    const { args, flags } = await this.parse(Extract);

    this.log(chalk.cyan("📄 File:"), args.file);
    this.log(chalk.cyan("🌐 Locales:"), flags.locales);

    let provider: Provider = "huggingface";
    if (flags.provider) {
      const p = flags.provider.toLowerCase();
      if (!VALID_PROVIDERS.includes(p as Provider)) {
        this.error(
          `❌ Invalid provider: ${flags.provider}. Valid options: ${VALID_PROVIDERS.join(
            ", "
          )}`
        );
      }

      provider = p as Provider;
    }

    this.log(chalk.cyan("🤖 Provider:"), provider);

    // Parse file
    const sourceFile = parseFile(args.file);
    const texts = extractTexts(sourceFile);

    if (texts.length === 0) {
      this.log(chalk.yellow("⚠️  No translatable texts found."));
      return;
    }

    const componentName = path
      .basename(args.file)
      .replace(/\.(tsx|jsx)$/, "");
    const locales = flags.locales.split(",");

    // Count unique strings
    const uniqueTexts = new Set(texts.map((t) => t.text));

    this.log(
      `🔍 Extracting strings... (${chalk.green(texts.length)} found, ${chalk.green(uniqueTexts.size)} unique)`
    );

    // Initialize cache and deduplicator
    const cwd = process.cwd();
    const projectDir = path.join(cwd, ".i18nizer");
    const cache = new TranslationCache(projectDir);
    const deduplicator = new Deduplicator(cache, flags["use-ai-keys"], provider);

    // Step 1: Generate keys (batch, cache-first)
    let keySpinner: Ora | undefined;
    if (flags["use-ai-keys"]) {
      keySpinner = ora("🧠 Generating keys (batch)...").start();
    } else {
      this.log("🔑 Generating keys (deterministic)...");
    }

    const textList = texts.map((t) => t.text);
    const deduplicationResults = await deduplicator.deduplicateBatch(
      textList,
      componentName,
      false // Don't detect duplicates for standalone extract
    );

    const stats = deduplicator.getStats();

    if (keySpinner) {
      keySpinner.succeed(
        `🧠 Generated ${chalk.green(uniqueTexts.size)} keys`
      );
    } else {
      this.log(`✅ Generated ${chalk.green(uniqueTexts.size)} keys (deterministic)`);
    }
    
    this.log(`💾 Cache hits: ${chalk.green(stats.cacheHits)}`);
    this.log(`🤖 AI requests used: ${chalk.green(stats.aiRequestsUsed)}`);

    // Map results back to texts
    const mappedTexts = texts.map((t) => {
      const result = deduplicationResults.get(t.text)!;
      return {
        isCached: result.isCached,
        key: result.key,
        node: t.node,
        placeholders: t.placeholders,
        tempKey: t.tempKey,
        text: t.text,
      };
    });

    // Step 2: Generate translations (batch, separate from key generation)
    const spinner = ora(`💬 Generating translations with ${provider}...`).start();

    try {
      // Build prompt with the keys we already generated
      const prompt = buildPrompt({
        componentName,
        locales,
        texts: mappedTexts.map((t) => ({ tempKey: t.tempKey, text: t.text })),
      });

      const raw = await generateTranslations(prompt, provider);

      if (!raw) throw new Error("AI did not return any data");

      const json = parseAiJson(raw);
      const namespace = componentName;
      const jsonNamespace =
        (json[namespace] as Record<string, Record<string, string>>) || {};

      const i18nJson: Record<string, Record<string, string>> = {};

      // Use our generated keys, not the AI's keys
      for (const mapped of mappedTexts) {
        const translations = jsonNamespace[mapped.tempKey];
        if (!translations) {
          throw new Error(`No translations found for tempKey: ${mapped.tempKey}`);
        }

        i18nJson[mapped.key] = {};
        for (const locale of locales) {
          i18nJson[mapped.key][locale] = translations[locale];
        }

        // Update cache
        cache.set({
          componentName,
          key: mapped.key,
          locales: i18nJson[mapped.key],
          text: mapped.text,
        });
      }

      writeLocaleFiles(componentName, { [componentName]: i18nJson }, locales);

      spinner.succeed(`✅ Translations generated with ${provider}`);

      this.log(`🔗 Mapped ${chalk.green(mappedTexts.length)} texts to keys`);

      insertUseTranslations(sourceFile, componentName);
      replaceTempKeysWithT(
        mappedTexts.map((m) => ({
          key: m.key,
          node: m.node,
          placeholders: m.placeholders,
          tempKey: m.tempKey,
        }))
      );
      saveSourceFile(sourceFile);

      // Save cache
      cache.save();

      this.log(chalk.green("✨ Component rewritten with t() calls"));
      this.log(chalk.green(`🌍 JSON files generated using ${provider}`));
    } catch (error: unknown) {
      spinner.fail(`❌ Failed to generate translations with ${provider}`);
      if (error instanceof Error) {
        this.error(error.message);
      } else {
        this.error("An unknown error occurred");
      }
    }
  }
}
