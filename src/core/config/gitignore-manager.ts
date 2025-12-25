import fs from "node:fs";
import path from "node:path";

const I18NIZER_DIR = ".i18nizer/";

/**
 * Ensures that .i18nizer/ folder is added to .gitignore
 */
export function ensureI18nizerDirInGitignore(cwd: string): boolean {
  const gitignorePath = path.join(cwd, ".gitignore");
  const i18nizerDirPath = path.join(cwd, ".i18nizer");

  // Check if .i18nizer directory exists
  if (!fs.existsSync(i18nizerDirPath)) {
    return false;
  }

  // Create .gitignore if it doesn't exist
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, "", "utf8");
  }

  // Read current .gitignore content
  const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
  const lines = gitignoreContent.split("\n");

  // Check if .i18nizer/ is already ignored (exact match or pattern match)
  const isAlreadyIgnored = lines.some(
    (line) =>
      line.trim() === I18NIZER_DIR ||
      line.trim() === `/${I18NIZER_DIR}` ||
      line.trim() === ".i18nizer" ||
      line.trim() === "/.i18nizer" ||
      line.trim() === "**/.i18nizer/" ||
      line.trim() === "**/.i18nizer"
  );

  if (isAlreadyIgnored) {
    return false;
  }

  // Add .i18nizer/ to .gitignore
  const newContent =
    gitignoreContent.trim() === ""
      ? `${I18NIZER_DIR}\n`
      : `${gitignoreContent}${gitignoreContent.endsWith("\n") ? "" : "\n"}${I18NIZER_DIR}\n`;

  fs.writeFileSync(gitignorePath, newContent, "utf8");

  return true;
}
