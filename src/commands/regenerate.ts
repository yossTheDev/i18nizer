import { Command } from "@oclif/core";
import chalk from "chalk";

import {
  getMessagesDir,
  isProjectInitialized,
  loadConfig,
} from "../core/config/config-manager.js";
import { generateAggregator } from "../core/i18n/generate-aggregator.js";

export default class Regenerate extends Command {
  static override description =
    "♻️  Regenerate the messages.generated.ts aggregator file from JSON files";

  static override examples = [
    "<%= config.bin %> <%= command.id %>",
  ];

  async run() {
    const cwd = process.cwd();

    // Check if project is initialized
    if (!isProjectInitialized(cwd)) {
      this.error(
        chalk.red("❌ Project is not initialized.") +
          "\n" +
          chalk.yellow("💡 Run") +
          " " +
          chalk.bold("i18nizer start") +
          " " +
          chalk.yellow("to initialize the project first.")
      );
    }

    // Load config
    const config = loadConfig(cwd);
    if (!config) {
      this.error(
        chalk.red("❌ Could not load project configuration.")
      );
    }

    this.log(chalk.cyan("📋 Regenerating aggregator..."));

    // Get messages directory
    const messagesDir = getMessagesDir(cwd, config);

    // Generate aggregator
    generateAggregator(messagesDir);

    this.log("");
    this.log(chalk.green("✅ Aggregator regenerated successfully!"));
    this.log(
      chalk.gray("   All translation JSON files have been imported.")
    );
    this.log(
      chalk.gray("   File: ") + chalk.cyan("i18n/messages.generated.ts")
    );
  }
}
