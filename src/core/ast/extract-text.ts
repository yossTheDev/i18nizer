/* eslint-disable complexity */
import { Node } from "ts-morph";

import { isTranslatableString } from "./is-translatable.js";

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

/**
 * Recursively extract string literals from complex expressions
 * like ternary operators, logical operators, etc.
 */
function extractStringsFromExpression(expr: Node, results: ExtractedText[], seenNodes: Set<Node>): void {
    if (!expr || seenNodes.has(expr)) return;

    // String literal
    if (Node.isStringLiteral(expr)) {
        const text = expr.getLiteralText();
        if (isTranslatableString(expr, text)) {
            const tempKey = `i$fdw_${tempIdCounter++}`;
            results.push({ node: expr, placeholders: [], tempKey, text });
            seenNodes.add(expr);
        }

        return;
    }

    // Template literal
    if (Node.isTemplateExpression(expr) || Node.isNoSubstitutionTemplateLiteral(expr)) {
        const processed = processTemplateLiteral(expr);
        if (processed && isTranslatableString(expr, processed.text)) {
            const tempKey = `i$fdw_${tempIdCounter++}`;
            results.push({ node: expr, placeholders: processed.placeholders, tempKey, text: processed.text });
            seenNodes.add(expr);
        }

        return;
    }

    // Ternary operator: condition ? whenTrue : whenFalse
    if (Node.isConditionalExpression(expr)) {
        extractStringsFromExpression(expr.getWhenTrue(), results, seenNodes);
        extractStringsFromExpression(expr.getWhenFalse(), results, seenNodes);
        return;
    }

    // Binary expressions: logical AND (&&) and OR (||)
    if (Node.isBinaryExpression(expr)) {
        const operator = expr.getOperatorToken().getText();
        if (operator === "&&" || operator === "||") {
            // Extract from both sides to handle cases like 'text1' || 'text2'
            extractStringsFromExpression(expr.getLeft(), results, seenNodes);
            extractStringsFromExpression(expr.getRight(), results, seenNodes);
        }

        return;
    }

    // Parenthesized expression: (expression)
    if (Node.isParenthesizedExpression(expr)) {
        extractStringsFromExpression(expr.getExpression(), results, seenNodes);

    }
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
            if (text && isTranslatableString(node, text)) {
                const tempKey = `i$fdw_${tempIdCounter++}`;
                results.push({ node, placeholders, tempKey, text });
                seenNodes.add(node);
            }

            return;
        }

        // JSXExpression - handle complex expressions
        if (Node.isJsxExpression(node)) {
            const expr = node.getExpression();
            if (expr) {
                extractStringsFromExpression(expr, results, seenNodes);
            }

            return;
        }

        // StringLiteral in JSX attributes or function calls
        if (Node.isStringLiteral(node)) {
            text = node.getLiteralText();
        }

        // Template literals in function calls
        else if (Node.isTemplateExpression(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
            const processed = processTemplateLiteral(node);
            if (processed) {
                text = processed.text;
                placeholders = processed.placeholders;
            }
        }

        if (!text) return;
        if (!isTranslatableString(node, text)) return;

        const parent = node.getParent();

        let shouldExtract = false;

        // Check if this is in a JSX attribute that we care about
        if (Node.isJsxAttribute(parent) && allowedProps.has(parent.getNameNode().getText())) {
            shouldExtract = true;
        }
        // Check if this is in an allowed function call
        else if (Node.isCallExpression(parent)) {
            const fnName = getFullCallName(parent.getExpression());
            if (fnName && (allowedFunctions.has(fnName) || allowedMemberFunctions.has(fnName))) {
                shouldExtract = true;
            }
        }
        // Check if string is inside a JSX expression within an attribute
        else if (Node.isJsxExpression(parent)) {
            const jsxExprParent = parent.getParent();
            if (Node.isJsxAttribute(jsxExprParent) && allowedProps.has(jsxExprParent.getNameNode().getText())) {
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

        const tCall = `t("${key}"${placeholdersText ? `, ${placeholdersText}` : ""})`;

        if (Node.isJsxText(node)) {
            node.replaceWithText(`{${tCall}}`);
        } else if (Node.isStringLiteral(node)) {
            const parent = node.getParent();

            // Direct JSX attribute: placeholder="text"
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
            // String in function call
            else if (Node.isCallExpression(parent)) {
                const fnName = getFullCallName(parent.getExpression());
                if (fnName && (allowedFunctions.has(fnName) || allowedMemberFunctions.has(fnName))) {
                    node.replaceWithText(tCall);
                }
            }
        } else if (Node.isTemplateExpression(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
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
            // Template in function call
            else if (Node.isCallExpression(parent)) {
                const fnName = getFullCallName(parent.getExpression());
                if (fnName && (allowedFunctions.has(fnName) || allowedMemberFunctions.has(fnName))) {
                    node.replaceWithText(tCall);
                }
            }
        }
    }
}
