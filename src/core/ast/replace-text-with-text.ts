import { Node } from "ts-morph";

interface MappedText {
    key: string;
    node: Node;
    placeholders?: string[];
    tempKey: string;
}

const allowedProps = new Set(["alt", "aria-label", "placeholder", "title"]);
const allowedFunctions = new Set(["alert", "confirm", "prompt"]);

/**
 * Check if a node is inside a JSX expression or JSX attribute
 */
function isInsideJsxContext(node: Node): boolean {
    let ancestor = node.getParent();
    
    while (ancestor) {
        if (Node.isJsxExpression(ancestor) || Node.isJsxAttribute(ancestor)) {
            return true;
        }

        const nextAncestor = ancestor.getParent();
        if (!nextAncestor) break;
        ancestor = nextAncestor;
    }
    
    return false;
}

/**
 * Build the t() function call text
 */
function buildTCallText(key: string, placeholdersText: string): string {
    return `t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})`;
}

/**
 * Replace string literal nodes with t() calls
 */
function replaceStringLiteral(node: Node, key: string, placeholdersText: string): void {
    const parent = node.getParent();

    if (Node.isJsxAttribute(parent) && allowedProps.has(parent.getNameNode().getText())) {
        // Props de JSX → {t("key")}
        node.replaceWithText(`{${buildTCallText(key, placeholdersText)}}`);
    } else if (Node.isCallExpression(parent) && allowedFunctions.has(parent.getExpression().getText())) {
        // Literal dentro de alert/confirm/prompt → t("key", { ... })
        node.replaceWithText(buildTCallText(key, placeholdersText));
    } else if (isInsideJsxContext(node)) {
        // String literals inside JSX expressions (ternary, logical operators, etc.)
        node.replaceWithText(buildTCallText(key, placeholdersText));
    }
}

/**
 * Replace template literal nodes with t() calls
 */
function replaceTemplateLiteral(node: Node, key: string, placeholdersText: string): void {
    const parent = node.getParent();
    
    if (Node.isCallExpression(parent) && allowedFunctions.has(parent.getExpression().getText())) {
        // Template literal dentro de alert/confirm/prompt
        node.replaceWithText(buildTCallText(key, placeholdersText));
    } else if (isInsideJsxContext(node)) {
        // Template literals inside JSX expressions
        node.replaceWithText(buildTCallText(key, placeholdersText));
    }
}

export function replaceTempKeysWithT(mapped: MappedText[]) {
    for (const { key, node, placeholders = [] } of mapped) {
        const placeholdersText = placeholders.length > 0
            ? `{ ${placeholders.map(p => `${p}: ${p}`).join(", ")} }`
            : "";

        if (Node.isJsxText(node)) {
            // JSXText → {t("key")}
            node.replaceWithText(`{${buildTCallText(key, placeholdersText)}}`);
        } else if (Node.isStringLiteral(node)) {
            replaceStringLiteral(node, key, placeholdersText);
        } else if (Node.isNoSubstitutionTemplateLiteral(node) || Node.isTemplateExpression(node)) {
            replaceTemplateLiteral(node, key, placeholdersText);
        }
    }
}
