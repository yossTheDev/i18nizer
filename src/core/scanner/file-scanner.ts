import fs from "node:fs";
import path from "node:path";

/**
 * Recursively find all JSX/TSX files in a directory
 */
export function findComponentFiles(
  dir: string,
  extensions: string[] = [".tsx", ".jsx"]
): string[] {
  const results: string[] = [];

  function scan(currentDir: string) {
    if (!fs.existsSync(currentDir)) {
      return;
    }

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      // Skip common directories that shouldn't contain components
      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        !["node_modules", "dist", "build", ".next", "coverage"].includes(
          entry.name
        )
      ) {
        scan(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  }

  scan(dir);
  return results;
}

/**
 * Find component files in common React/Next.js directories
 */
export function findProjectComponents(cwd: string): string[] {
  const commonDirs = [
    "src",
    "app",
    "pages",
    "components",
    "lib",
    "features",
    "modules",
  ];

  const files: string[] = [];

  for (const dir of commonDirs) {
    const fullPath = path.join(cwd, dir);
    if (fs.existsSync(fullPath)) {
      files.push(...findComponentFiles(fullPath));
    }
  }

  return files;
}
