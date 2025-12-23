/* eslint-disable complexity */
import { Node } from "ts-morph";

let tempIdCounter = 0;

const allowedFunctions = new Set(["alert", "confirm", "prompt"]);
const allowedMemberFunctions = new Set(["toast.error", "toast.info", "toast.success", "toast.warn"]);
const allowedProps = new Set(["alt", "aria-label", "placeholder", "title"]);

export interface ExtractedText {
    node: Node;
    placeholders: string[];
    tempKey: string;
    text: string;
}

// --- Helpers ---

function processTemplateLiteral(node: Node): null | { placeholders: string[]; text: string } {
    if (Node.isNoSubstitutionTemplateLiteral(node)) {
        return { placeholders: [], text: node.getLiteralText() };
    }

    if (Node.isTemplateExpression(node)) {
        let text = node.getHead().getLiteralText();
        const placeholders: string[] = [];
        for (const span of node.getTemplateSpans()) {
            const exprText = span.getExpression().getText();
            const literalText = span.getLiteral().getLiteralText();
            text += `{${exprText}}${literalText}`;
            placeholders.push(exprText);
        }

        return { placeholders, text };
    }

    return null;
}

function getFullCallName(node: Node): null | string {
    if (Node.isIdentifier(node)) return node.getText();
    if (Node.isPropertyAccessExpression(node)) {
        const expr = getFullCallName(node.getExpression());
        if (expr) return `${expr}.${node.getName()}`;
    }

    return null;
}

// --- Extractor ---
export function extractTexts(sourceFile: Node): ExtractedText[] {
    const results: ExtractedText[] = [];
    const seenNodes = new Set<Node>();

    sourceFile.forEachDescendant((node: Node) => {
        if (seenNodes.has(node)) return;

        let text: null | string = null;
        let placeholders: string[] = [];

        // JSXText
        if (Node.isJsxText(node)) {
            text = node.getText().trim();
        }

        // JSXExpression con TemplateLiteral
        else if (Node.isJsxExpression(node)) {
            const expr = node.getExpression();
            if (expr && (Node.isTemplateExpression(expr) || Node.isNoSubstitutionTemplateLiteral(expr))) {
                const processed = processTemplateLiteral(expr);
                if (processed) {
                    text = processed.text;
                    placeholders = processed.placeholders;
                }
            }
        }

        // StringLiteral
        else if (Node.isStringLiteral(node)) {
            text = node.getLiteralText();
        }

        else if (Node.isTemplateExpression(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
            text = processTemplateLiteral(node)?.text ?? null;
            placeholders = processTemplateLiteral(node)?.placeholders ?? [];
        }

        if (!text) return;

        const parent = node.getParent();

        let shouldExtract = false;

        if (Node.isJsxText(node)) {
            shouldExtract = true;
        } else if (Node.isJsxAttribute(parent) && allowedProps.has(parent.getNameNode().getText())) {
            shouldExtract = true;
        } else if (Node.isCallExpression(parent)) {
            const fnName = getFullCallName(parent.getExpression());
            if (fnName && (allowedFunctions.has(fnName) || allowedMemberFunctions.has(fnName))) {
                shouldExtract = true;
            }
        }

        if (shouldExtract) {
            const tempKey = `i$fdw_${tempIdCounter++}`;
            results.push({ node, placeholders, tempKey, text });
            seenNodes.add(node);
        }
    });

    return results;
}

// --- Replacer ---
interface MappedText {
    key: string;
    node: Node;
    placeholders?: string[];
}

export function replaceTempKeysWithT(mapped: MappedText[]) {
    for (const { key, node, placeholders = [] } of mapped) {
        const placeholdersText = placeholders.length > 0
            ? `{ ${placeholders.map(p => `${p}: ${p}`).join(", ")} }`
            : "";

        if (Node.isJsxText(node)) {
            node.replaceWithText(`{t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})}`);
        } else if (Node.isStringLiteral(node)) {
            const parent = node.getParent();
            if (Node.isJsxAttribute(parent) && allowedProps.has(parent.getNameNode().getText())) {
                node.replaceWithText(`{t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})}`);
            } else if (Node.isCallExpression(parent)) {
                const fnName = getFullCallName(parent.getExpression());
                if (fnName && (allowedFunctions.has(fnName) || allowedMemberFunctions.has(fnName))) {
                    node.replaceWithText(`t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})`);
                }
            }
        } else if (Node.isTemplateExpression(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
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
