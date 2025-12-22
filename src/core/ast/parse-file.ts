import { Project } from "ts-morph";

export function parseFile(filePath: string) {
    const project = new Project({
        tsConfigFilePath: "tsconfig.json",
    });

    return project.addSourceFileAtPath(filePath);
}
