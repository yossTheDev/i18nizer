import chalk from "chalk";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { componentNameToFilename } from "./filename-utils.js";

const DEFAULT_CONFIG_DIR = path.join(os.homedir(), ".i18nizer", "messages");

export function writeLocaleFiles(
    namespace: string,
    data: Record<string, Record<string, Record<string, string>>>,
    locales: string[],
    outputDir?: string
) {
    const baseDir = outputDir ?? DEFAULT_CONFIG_DIR;
    
    // Convert namespace to lowercase-hyphen format for filename
    const filename = componentNameToFilename(namespace);
    
    for (const locale of locales) {
        const content: Record<string, Record<string, string>> = {};
        content[namespace] = {};

        // Sort keys for stable output
        const sortedKeys = Object.keys(data[namespace]).sort();

        for (const key of sortedKeys) {
            content[namespace][key] = data[namespace][key][locale];
        }

        const dir = path.join(baseDir, locale);
        fs.mkdirSync(dir, { recursive: true });

        const filePath = path.join(dir, `${filename}.json`);
        
        // Use 2-space indentation for clean, readable JSON
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + "\n");

        console.log(chalk.green(`💾 Locale file saved: ${filePath}`));
    }
}
