import { SourceFile } from "ts-morph";

export function saveSourceFile(sourceFile: SourceFile) {
    sourceFile.saveSync();
}