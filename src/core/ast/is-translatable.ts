import { Node } from "ts-morph";

const IGNORED_PROPS = new Set([
    "class",
    "className",
    "id",
    "key",
]);

export function isTranslatableString(node: Node, text: string): boolean {
    const parent = node.getParent();

    // Empty or whitespace-only strings
    if (!text || text.trim().length === 0) {
        return false;
    }

    // Single character symbols and punctuation-only strings
    const trimmedText = text.trim();
    // Check if the string is only punctuation/symbols (no letters or digits)
    if (/^[^\w\s]+$/.test(trimmedText)) {
        return false;
    }

    // use client / use server
    if (text === "use client" || text === "use server") {
        return false;
    }

    // imports
    if (Node.isImportDeclaration(parent)) return false;

    // JSX attributes (className, id, etc)
    if (Node.isJsxAttribute(parent)) {
        const name = parent.getNameNode().getText();
        if (IGNORED_PROPS.has(name)) {
            return false;
        }
    }

    // Tailwind heurística (simple y efectiva)
    if (/^(flex|grid|gap-|bg-|text-|p-|m-|w-|h-)/.test(text)) {
        return false;
    }

    // paths
    if (text.startsWith("/") || text.startsWith("./")) {
        return false;
    }

    // console.*
    if (
        Node.isCallExpression(parent) &&
        parent.getExpression().getText().startsWith("console.")
    ) {
        return false;
    }

    return true;
}
