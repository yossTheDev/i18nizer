import fs from "node:fs";
import { Project, ts } from "ts-morph";

/**
 * Parse a TSX/JSX file using ts-morph
 * Works with any absolute or relative path
 */
export function parseFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    // Create a completely empty Project
    const project = new Project({
        compilerOptions: {
            allowJs: true,
            esModuleInterop: true,
            jsx: ts.JsxEmit.React,
            skipLibCheck: true,
            strict: false,
            target: 3 // ES2022
        },
        useInMemoryFileSystem: false
    });

    // Add only the single file
    return project.addSourceFileAtPath(filePath);
}
