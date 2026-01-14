/* eslint-disable complexity */
import { Node } from "ts-morph";

import { isTranslatableString } from "./is-translatable.js";

let tempIdCounter = 0;

// Default sets - can be overridden via extractTexts options
const defaultAllowedFunctions = new Set(["alert", "confirm", "prompt"]);
const defaultAllowedMemberFunctions = new Set(["toast.error", "toast.info", "toast.success", "toast.warn"]);
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

export interface ExtractedText {
    node: Node;
    placeholders: string[];
    tempKey: string;
    text: string;
    isPlural?: boolean;
    pluralVariable?: string;
    pluralForms?: {
        one: string;
        other: string;
    };
    isRichText?: boolean;
    richTextElements?: Array<{
        tag: string;
        placeholder: string;
    }>;
}

export interface ExtractOptions {
    allowedFunctions?: string[];
    allowedMemberFunctions?: string[];
    allowedProps?: string[];
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

/**
 * Detect pluralization pattern in a ternary expression
 * Pattern: variable === 1 ? 'singular' : 'plural'
 */
function detectPluralizationPattern(expr: Node): null | {
    pluralVariable: string;
    one: string;
    other: string;
} {
    if (!Node.isConditionalExpression(expr)) return null;

    const condition = expr.getCondition();
    const whenTrue = expr.getWhenTrue();
    const whenFalse = expr.getWhenFalse();

    // Check if condition is a binary expression (e.g., count === 1 or count == 1)
    if (!Node.isBinaryExpression(condition)) return null;

    const operator = condition.getOperatorToken().getText();
    if (operator !== "===" && operator !== "==") return null;

    const left = condition.getLeft();
    const right = condition.getRight();

    // Check if one side is 1 and the other is a variable
    let variable: null | string = null;
    let isCheckingForOne = false;

    if (Node.isNumericLiteral(right) && right.getLiteralValue() === 1 && Node.isIdentifier(left)) {
        variable = left.getText();
        isCheckingForOne = true;
    } else if (Node.isNumericLiteral(left) && left.getLiteralValue() === 1 && Node.isIdentifier(right)) {
        variable = right.getText();
        isCheckingForOne = true;
    }

    if (!variable || !isCheckingForOne) return null;

    // Extract singular and plural forms
    let singular: null | string = null;
    let plural: null | string = null;

    if (Node.isStringLiteral(whenTrue)) {
        singular = whenTrue.getLiteralText();
    }

    if (Node.isStringLiteral(whenFalse)) {
        plural = whenFalse.getLiteralText();
    }

    if (!singular || !plural) return null;

    return {
        pluralVariable: variable,
        one: singular,
        other: plural,
    };
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
        // Check if this is a pluralization pattern
        const pluralPattern = detectPluralizationPattern(expr);
        
        if (pluralPattern) {
            // This is a pluralization pattern, create a single entry for it
            const tempKey = `i$fdw_${tempIdCounter++}`;
            const text = pluralPattern.other; // Use plural form as base text
            
            results.push({
                node: expr,
                placeholders: [pluralPattern.pluralVariable],
                tempKey,
                text,
                isPlural: true,
                pluralVariable: pluralPattern.pluralVariable,
                pluralForms: {
                    one: pluralPattern.one,
                    other: pluralPattern.other,
                },
            });
            seenNodes.add(expr);
            // Mark child nodes as seen to avoid duplicate extraction
            seenNodes.add(expr.getWhenTrue());
            seenNodes.add(expr.getWhenFalse());
            return;
        }
        
        // Not a pluralization pattern, extract strings normally
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
export function extractTexts(sourceFile: Node, options: ExtractOptions = {}): ExtractedText[] {
    const allowedFunctions = new Set(options.allowedFunctions ?? [...defaultAllowedFunctions]);
    const allowedMemberFunctions = new Set(options.allowedMemberFunctions ?? [...defaultAllowedMemberFunctions]);
    const allowedProps = new Set(options.allowedProps ?? [...defaultAllowedProps]);
    
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
