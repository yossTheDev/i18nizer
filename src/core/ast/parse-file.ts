import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Project } from "ts-morph";

const CONFIG_DIR = path.join(os.homedir(), ".i18nizer");
const TSCONFIG_PATH = path.join(CONFIG_DIR, "tsconfig.json");

/**
 * Ensure the .i18nizer folder and tsconfig exist
 */
function ensureTsConfig() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
        console.log(`⚡ Created folder ${CONFIG_DIR}`);
    }

    if (!fs.existsSync(TSCONFIG_PATH)) {
        const defaultTsConfig = {
            compilerOptions: {
                allowJs: true,
                checkJs: false,
                esModuleInterop: true,
                jsx: "preserve",
                module: "ESNext",
                moduleResolution: "node",
                skipLibCheck: true,
                strict: false,
                target: "ES2022"
            },
            include: ["../**/*.ts", "../**/*.tsx", "../**/*.js", "../**/*.jsx"]
        };

        fs.writeFileSync(TSCONFIG_PATH, JSON.stringify(defaultTsConfig, null, 2), "utf8");
    }
}

/**
 * Parse a TSX/JSX file using ts-morph with the CLI's own tsconfig
 */
export function parseFile(filePath: string) {
    ensureTsConfig();

    const project = new Project({
        tsConfigFilePath: TSCONFIG_PATH,
    });

    return project.addSourceFileAtPath(filePath);
}
