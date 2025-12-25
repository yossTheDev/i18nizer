import fs from "node:fs";
import path from "node:path";

const CONFIG_FILE_NAME = "i18nizer.config.yml";

/**
 * Ensures that i18nizer.config.yml is added to .gitignore if it exists
 */
export function ensureConfigInGitignore(cwd: string): boolean {
  const configPath = path.join(cwd, CONFIG_FILE_NAME);
  const gitignorePath = path.join(cwd, ".gitignore");

  // Check if config file exists
  if (!fs.existsSync(configPath)) {
    return false;
  }

  // Create .gitignore if it doesn't exist
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, "", "utf8");
  }

  // Read current .gitignore content
  const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
  const lines = gitignoreContent.split("\n");

  // Check if config is already ignored (exact match or pattern match)
  const isAlreadyIgnored = lines.some(
    (line) =>
      line.trim() === CONFIG_FILE_NAME ||
      line.trim() === `/${CONFIG_FILE_NAME}` ||
      line.trim() === `**/${CONFIG_FILE_NAME}`
  );

  if (isAlreadyIgnored) {
    return false;
  }

  // Add config to .gitignore
  const newContent =
    gitignoreContent.trim() === ""
      ? `${CONFIG_FILE_NAME}\n`
      : `${gitignoreContent.endsWith("\n") ? "" : "\n"}${CONFIG_FILE_NAME}\n`;

  fs.writeFileSync(gitignorePath, gitignoreContent + (gitignoreContent.trim() === "" ? CONFIG_FILE_NAME + "\n" : (gitignoreContent.endsWith("\n") ? "" : "\n") + CONFIG_FILE_NAME + "\n"), "utf8");

  return true;
}
