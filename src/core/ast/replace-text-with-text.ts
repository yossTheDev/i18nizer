import { Node } from "ts-morph";

interface MappedText {
    key: string;
    node: Node;
    placeholders?: string[];
    tempKey: string;
}

const allowedProps = new Set(["alt", "aria-label", "placeholder", "title"]);
const allowedFunctions = new Set(["alert", "confirm", "prompt"]);

export function replaceTempKeysWithT(mapped: MappedText[]) {
    for (const { key, node, placeholders = [] } of mapped) {
        const placeholdersText = placeholders.length > 0
            ? `{ ${placeholders.map(p => `${p}: ${p}`).join(", ")} }`
            : "";

        if (Node.isJsxText(node)) {
            // JSXText → {t("key")}
            node.replaceWithText(`{t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})}`);
        } else if (Node.isStringLiteral(node)) {
            const parent = node.getParent();

            if (Node.isJsxAttribute(parent) && allowedProps.has(parent.getNameNode().getText())) {
                // Props de JSX → {t("key")}
                node.replaceWithText(`{t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})}`);
            } else if (Node.isCallExpression(parent) && allowedFunctions.has(parent.getExpression().getText())) {
                // Literal dentro de alert/confirm/prompt → t("key", { ... })
                node.replaceWithText(`t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})`);
            }
        } else if (Node.isNoSubstitutionTemplateLiteral(node) || Node.isTemplateExpression(node)) {
            const parent = node.getParent();
            if (Node.isCallExpression(parent) && allowedFunctions.has(parent.getExpression().getText())) {
                // Template literal dentro de alert/confirm/prompt
                node.replaceWithText(`t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})`);
            }
        }
    }
}
