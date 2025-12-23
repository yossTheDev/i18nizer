import { Args, Command, Flags } from "@oclif/core";
import chalk from "chalk";
import path from "node:path";
import ora from "ora";

import { generateTranslations, Provider } from "../core/ai/client.js";
import { buildPrompt } from "../core/ai/promt.js";
import { extractTexts } from "../core/ast/extract-text.js";
import { insertUseTranslations } from "../core/ast/insert-user-translations.js";
import { parseFile } from "../core/ast/parse-file.js";
import { replaceTempKeysWithT } from "../core/ast/replace-text-with-text.js";
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

    this.log(`🔍 Found ${chalk.green(texts.length)} translatable texts`);

    const componentName = path
      .basename(args.file)
      .replace(/\.(tsx|jsx)$/, "");
    const locales = flags.locales.split(",");

    const spinner = ora(`💬 Generating translations with ${provider}...`).start();

    try {
      const prompt = buildPrompt({
        componentName,
        locales,
        texts: texts.map((t) => ({ tempKey: t.tempKey, text: t.text })),
      });

      const raw = await generateTranslations(prompt, provider);

      if (!raw) throw new Error("AI did not return any data");


      const json = parseAiJson(raw);
      const namespace = componentName;
      const jsonNamespace = json[namespace] as Record<string, Record<string, string>> || {};

      const i18nJson: Record<string, Record<string, string>> = {};

      for (const [, translations] of Object.entries(jsonNamespace)) {
        const { key } = translations;
        i18nJson[key] = {};
        for (const locale of locales) {
          i18nJson[key][locale] = translations[locale];
        }
      }

      writeLocaleFiles(componentName, { [componentName]: i18nJson }, locales);


      spinner.succeed(`✅ Translations generated with ${provider}`);

      // const aiGeneratedKeys = Object.keys(json[namespace] || {});


      const mapped = texts.map(t => {
        const translations = jsonNamespace[t.tempKey];
        if (!translations) {
          throw new Error(`No translations found for tempKey: ${t.tempKey}`);
        }

        return {
          key: translations.key,
          node: t.node,
          placeholders: t.placeholders,
          tempKey: t.tempKey
        };
      });


      this.log(`🔗 Mapped ${chalk.green(mapped.length)} texts to keys`);

      insertUseTranslations(sourceFile, componentName);
      replaceTempKeysWithT(mapped);
      saveSourceFile(sourceFile);

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
