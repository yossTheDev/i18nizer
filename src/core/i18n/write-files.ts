import chalk from "chalk";
import fs from "node:fs";
import path from "node:path";

export function writeLocaleFiles(
    namespace: string,
    data: Record<string, Record<string, Record<string, string>>>,
    locales: string[]
) {
    for (const locale of locales) {
        const content: Record<string, Record<string, string>> = {};
        content[namespace] = {};

        for (const key of Object.keys(data[namespace])) {
            content[namespace][key] = data[namespace][key][locale];
        }

        const dir = path.join(process.cwd(), "messages", locale);
        fs.mkdirSync(dir, { recursive: true });

        const filePath = path.join(dir, `${namespace}.json`);
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));

        console.log(chalk.green(`💾 Locale file saved: ${filePath}`));
    }
}
