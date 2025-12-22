import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import ora from "ora";

const CONFIG_DIR = path.join(os.homedir(), ".18nizer");
const CONFIG_FILE = path.join(CONFIG_DIR, "api-keys.json");

type ApiKeys = {
  gemini?: string;
  huggingface?: string;
  openai?: string;
};

export default class Keys extends Command {
  static override description = "Manage API keys for your CLI";
  static override flags = {
    setGemini: Flags.string({
      char: "g",
      description: "Set Google Gemini API key",
    }),
    setHF: Flags.string({
      char: "h",
      description: "Set Hugging Face API key",
    }),
    setOpenAI: Flags.string({
      char: "o",
      description: "Set OpenAI API key",
    }),
    show: Flags.boolean({
      char: "s",
      description: "Show saved keys (masked)",
    }),
  };

  async run() {
    const { flags } = await this.parse(Keys);

    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }

    let keys: ApiKeys = {};
    if (fs.existsSync(CONFIG_FILE)) {
      try {
        keys = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
      } catch {
        this.error("❌ Could not read existing keys file.");
      }
    }

    // Set keys
    if (flags.setGemini) {
      keys.gemini = flags.setGemini;
      this.log(chalk.green("✅ Gemini API key set"));
    }

    if (flags.setHF) {
      keys.huggingface = flags.setHF;
      this.log(chalk.green("✅ Hugging Face API key set"));
    }

    if (flags.setOpenAI) {
      keys.openai = flags.setOpenAI;
      this.log(chalk.green("✅ OpenAI API key set"));
    }

    // Save keys
    if (flags.setGemini || flags.setHF || flags.setOpenAI) {
      const spinner = ora("Saving keys...").start();
      try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(keys, null, 2), { mode: 0o600 });
        spinner.succeed(`💾 Keys saved successfully at ${CONFIG_FILE}`);
      } catch {
        spinner.fail("❌ Failed to save keys");
      }
    }

    // Show keys (masked)
    if (flags.show) {
      this.log("🔑 Saved API keys:");
      this.log(
        "Gemini: ",
        keys.gemini ? keys.gemini.slice(0, 4) + "****" : chalk.yellow("not set")
      );
      this.log(
        "Hugging Face: ",
        keys.huggingface ? keys.huggingface.slice(0, 4) + "****" : chalk.yellow("not set")
      );
    }
  }
}
