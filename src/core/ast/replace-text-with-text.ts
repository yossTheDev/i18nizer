/* eslint-disable complexity */
import { Node } from "ts-morph";

interface MappedText {
    key: string;
    node: Node;
    placeholders?: string[];
    tempKey: string;
}

// Allowed JSX props to replace text
const allowedProps = new Set(["alt", "aria-label", "placeholder", "title"]);

// Allowed functions for simple calls
const allowedFunctions = new Set(["alert", "confirm", "prompt"]);

// Allowed member functions (e.g., toast.error)
const allowedMemberFunctions = new Set(["toast.error", "toast.info", "toast.success", "toast.warn"]);

// Helper to get full call name for member expressions
function getFullCallName(node: Node): null | string {
    if (Node.isIdentifier(node)) {
        return node.getText();
    }

    if (Node.isPropertyAccessExpression(node)) {
        const expr = getFullCallName(node.getExpression());
        if (expr) {
            return `${expr}.${node.getName()}`;
        }
    }

    return null;
}

export function replaceTempKeysWithT(mapped: MappedText[]) {
    for (const { key, node, placeholders = [] } of mapped) {
        // Build placeholders string if any
        const placeholdersText = placeholders.length > 0
            ? `{ ${placeholders.map(p => `${p}: ${p}`).join(", ")} }`
            : "";

        // Replace JSXText nodes → {t("key")}
        if (Node.isJsxText(node)) {
            node.replaceWithText(`{t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})}`);
        }
        // Replace string literals
        else if (Node.isStringLiteral(node)) {
            const parent = node.getParent();

            // JSX attributes allowed → {t("key")}
            if (Node.isJsxAttribute(parent) && allowedProps.has(parent.getNameNode().getText())) {
                node.replaceWithText(`{t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})}`);
            }
            // Simple or member function calls (alert, confirm, prompt, toast.*)
            else if (Node.isCallExpression(parent)) {
                const fnName = getFullCallName(parent.getExpression());
                if (fnName && (allowedFunctions.has(fnName) || allowedMemberFunctions.has(fnName))) {
                    node.replaceWithText(`t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})`);
                }
            }
        }
        // Replace template literals inside allowed calls
        else if (Node.isNoSubstitutionTemplateLiteral(node) || Node.isTemplateExpression(node)) {
            const parent = node.getParent();
            if (Node.isCallExpression(parent)) {
                const fnName = getFullCallName(parent.getExpression());
                if (fnName && (allowedFunctions.has(fnName) || allowedMemberFunctions.has(fnName))) {
                    node.replaceWithText(`t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})`);
                }
            }
        }
    }
}
