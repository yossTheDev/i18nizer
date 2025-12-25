import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import ora from "ora";

import {
  detectFramework,
  generateConfig,
  getMessagesDir,
  getProjectDir,
  isProjectInitialized,
  writeConfig,
} from "../core/config/config-manager.js";
import { Framework } from "../types/config.js";

export default class Start extends Command {
  static override description =
    "🚀 Initialize i18nizer in your project with framework presets";

  static override flags = {
    force: Flags.boolean({
      char: "f",
      default: false,
      description: "Force re-initialization even if config exists",
    }),
    preset: Flags.string({
      char: "p",
      description: "Framework preset (nextjs, react, custom)",
      options: ["nextjs", "react", "custom"],
    }),
  };

  async run() {
    const { flags } = await this.parse(Start);
    const cwd = process.cwd();

    // Check if already initialized
    if (isProjectInitialized(cwd) && !flags.force) {
      this.log(chalk.yellow("⚠️  Project is already initialized!"));
      this.log(
        chalk.cyan("💡 Use"),
        chalk.bold("--force"),
        chalk.cyan("to re-initialize")
      );
      return;
    }

    const spinner = ora("Initializing i18nizer...").start();

    try {
      // Detect or use specified framework
      let framework: Framework;
      if (flags.preset) {
        framework = flags.preset as Framework;
        spinner.text = `Using ${framework} preset...`;
      } else {
        spinner.text = "Detecting project framework...";
        framework = detectFramework(cwd);
        spinner.text = `Detected ${framework} project`;
      }

      // Generate config
      const config = generateConfig(framework);

      // Create project directory
      const projectDir = getProjectDir(cwd);
      spinner.succeed(`✅ Created ${chalk.cyan(".i18nizer/")} directory`);

      // Write config file
      spinner.start("Writing configuration file...");
      writeConfig(cwd, config);
      spinner.succeed(
        `✅ Created ${chalk.cyan("i18nizer.config.yml")} with ${chalk.bold(framework)} preset`
      );

      // Create messages directory
      spinner.start("Setting up messages directory...");
      const messagesDir = getMessagesDir(cwd, config);
      spinner.succeed(
        `✅ Created ${chalk.cyan(config.messages.path + "/")} directory`
      );

      // Summary
      this.log("");
      this.log(chalk.green("🎉 i18nizer initialized successfully!"));
      this.log("");
      this.log(chalk.bold("📋 Configuration:"));
      this.log(`  Framework: ${chalk.cyan(config.framework)}`);
      this.log(`  i18n Function: ${chalk.cyan(config.i18n.function)}`);
      this.log(
        `  Import: ${chalk.cyan(config.i18n.import.named)} from "${chalk.cyan(config.i18n.import.source)}"`
      );
      this.log(`  Messages Path: ${chalk.cyan(config.messages.path)}`);
      this.log(
        `  Default Locale: ${chalk.cyan(config.messages.defaultLocale)}`
      );
      this.log("");
      this.log(chalk.bold("🚀 Next steps:"));
      this.log(
        `  1. Review and customize ${chalk.cyan("i18nizer.config.yml")}`
      );
      this.log(
        `  2. Run ${chalk.cyan("i18nizer translate --all")} to translate all components`
      );
      this.log(
        `  3. Or translate a single file: ${chalk.cyan("i18nizer translate <file>")}`
      );
      this.log("");
    } catch (error: unknown) {
      spinner.fail("❌ Initialization failed");
      if (error instanceof Error) {
        this.error(error.message);
      } else {
        this.error("An unknown error occurred");
      }
    }
  }
}
