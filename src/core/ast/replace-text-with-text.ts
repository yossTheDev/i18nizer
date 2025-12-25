/* eslint-disable complexity */
import { Node } from "ts-morph";

interface MappedText {
    key: string;
    node: Node;
    placeholders?: string[];
    tempKey: string;
}

export interface ReplaceOptions {
    allowedFunctions?: string[];
    allowedMemberFunctions?: string[];
    allowedProps?: string[];
}

// Default allowed JSX props to replace text
const defaultAllowedProps = new Set([
    "alt",
    "aria-label",
    "aria-placeholder",
    "helperText",
    "label",
    "placeholder",
    "text",
    "title",
    "tooltip",
]);

// Default allowed functions for simple calls
const defaultAllowedFunctions = new Set(["alert", "confirm", "prompt"]);

// Default allowed member functions (e.g., toast.error)
const defaultAllowedMemberFunctions = new Set(["toast.error", "toast.info", "toast.success", "toast.warn"]);

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

export function replaceTempKeysWithT(mapped: MappedText[], options: ReplaceOptions = {}) {
    const allowedProps = new Set(options.allowedProps ?? [...defaultAllowedProps]);
    const allowedFunctions = new Set(options.allowedFunctions ?? [...defaultAllowedFunctions]);
    const allowedMemberFunctions = new Set(options.allowedMemberFunctions ?? [...defaultAllowedMemberFunctions]);
    
    for (const { key, node, placeholders = [] } of mapped) {
        // Build placeholders string if any
        const placeholdersText = placeholders.length > 0
            ? `{ ${placeholders.map(p => `${p}: ${p}`).join(", ")} }`
            : "";

        const tCall = `t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})`;

        // Replace JSXText nodes → {t("key")}
        if (Node.isJsxText(node)) {
            node.replaceWithText(`{${tCall}}`);
        }
        // Replace string literals
        else if (Node.isStringLiteral(node)) {
            const parent = node.getParent();

            // JSX attributes allowed → {t("key")}
            if (Node.isJsxAttribute(parent) && allowedProps.has(parent.getNameNode().getText())) {
                node.replaceWithText(`{${tCall}}`);
            }
            // String in JSX expression (e.g., within ternary): placeholder={condition ? "text" : ...}
            else if (Node.isJsxExpression(parent)) {
                node.replaceWithText(tCall);
            }
            // String in conditional expression
            else if (Node.isConditionalExpression(parent)) {
                node.replaceWithText(tCall);
            }
            // String in binary expression (&&, ||)
            else if (Node.isBinaryExpression(parent)) {
                node.replaceWithText(tCall);
            }
            // String in parenthesized expression
            else if (Node.isParenthesizedExpression(parent)) {
                node.replaceWithText(tCall);
            }
            // Simple or member function calls (alert, confirm, prompt, toast.*)
            else if (Node.isCallExpression(parent)) {
                const fnName = getFullCallName(parent.getExpression());
                if (fnName && (allowedFunctions.has(fnName) || allowedMemberFunctions.has(fnName))) {
                    node.replaceWithText(tCall);
                }
            }
        }
        // Replace template literals
        else if (Node.isNoSubstitutionTemplateLiteral(node) || Node.isTemplateExpression(node)) {
            const parent = node.getParent();
            
            // Template in JSX expression
            if (Node.isJsxExpression(parent)) {
                node.replaceWithText(tCall);
            }
            // Template in conditional expression
            else if (Node.isConditionalExpression(parent)) {
                node.replaceWithText(tCall);
            }
            // Template in binary expression
            else if (Node.isBinaryExpression(parent)) {
                node.replaceWithText(tCall);
            }
            // Template in function calls
            else if (Node.isCallExpression(parent)) {
                const fnName = getFullCallName(parent.getExpression());
                if (fnName && (allowedFunctions.has(fnName) || allowedMemberFunctions.has(fnName))) {
                    node.replaceWithText(tCall);
                }
            }
        }
    }
}
