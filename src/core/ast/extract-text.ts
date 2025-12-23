import { Node } from "ts-morph";

let tempIdCounter = 0;
const allowedFunctions = new Set(["alert", "confirm", "prompt"]);

export interface ExtractedText {
    node: Node;
    placeholders: string[];
    tempKey: string;
    text: string;
}

function processTemplateLiteral(node: Node): null | { placeholders: string[]; text: string; } {
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
 * Recursively extract string literals from conditional expressions
 * Handles ternary (? :), logical AND (&&), logical OR (||)
 */
function extractStringsFromExpression(node: Node, results: ExtractedText[]): void {
    // Handle ternary operator: condition ? "text1" : "text2"
    if (Node.isConditionalExpression(node)) {
        // Process the whenTrue branch
        extractStringsFromExpression(node.getWhenTrue(), results);
        // Process the whenFalse branch
        extractStringsFromExpression(node.getWhenFalse(), results);

        return;
    }

    // Handle binary expressions (logical AND, OR)
    if (Node.isBinaryExpression(node)) {
        const operator = node.getOperatorToken().getText();
        // Only process logical operators
        if (operator === "&&" || operator === "||") {
            // Process right side (the text part)
            extractStringsFromExpression(node.getRight(), results);
        }

        return;
    }

    // Handle parenthesized expressions
    if (Node.isParenthesizedExpression(node)) {
        extractStringsFromExpression(node.getExpression(), results);

        return;
    }

    // Extract string literal
    if (Node.isStringLiteral(node)) {
        const text = node.getLiteralText();
        const tempKey = `i$fdw_${tempIdCounter++}`;
        results.push({ node, placeholders: [], tempKey, text });

        return;
    }

    // Extract template literal
    if (Node.isTemplateExpression(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
        const processed = processTemplateLiteral(node);
        if (processed) {
            const tempKey = `i$fdw_${tempIdCounter++}`;
            results.push({ node, placeholders: processed.placeholders, tempKey, text: processed.text });
        }
    }
}

export function extractTexts(sourceFile: Node): ExtractedText[] {
    const results: ExtractedText[] = [];

    sourceFile.forEachDescendant((node: Node) => {
        // JSX TEXT simple
        if (Node.isJsxText(node)) {
            const text = node.getText().trim();
            if (text) {
                const tempKey = `i$fdw_${tempIdCounter++}`;
                results.push({ node, placeholders: [], tempKey, text });
            }
        }

        // JSX Expression - handle complex expressions
        if (Node.isJsxExpression(node)) {
            const expr = node.getExpression();
            if (!expr) return;

            // Handle template literals
            if (Node.isTemplateExpression(expr) || Node.isNoSubstitutionTemplateLiteral(expr)) {
                const processed = processTemplateLiteral(expr);
                if (processed) {
                    const tempKey = `i$fdw_${tempIdCounter++}`;
                    results.push({ node: expr, placeholders: processed.placeholders, tempKey, text: processed.text });
                }

                return;
            }

            // Handle conditional expressions, logical operators, and string literals in JSX children/attributes
            extractStringsFromExpression(expr, results);
        }

        // STRING LITERALS in JSX attributes
        if (Node.isStringLiteral(node)) {
            const text = node.getLiteralText();
            const parent = node.getParent();

            // JSX Attributes permitidos
            const allowedProps = ["placeholder", "title", "alt", "aria-label"];
            if (Node.isJsxAttribute(parent) && allowedProps.includes(parent.getNameNode().getText())) {
                // Check if already processed by extractStringsFromExpression
                const alreadyProcessed = results.some(r => r.node === node);
                if (!alreadyProcessed) {
                    const tempKey = `i$fdw_${tempIdCounter++}`;
                    results.push({ node, placeholders: [], tempKey, text });
                }
            }

            // Funciones tipo alert, confirm, prompt
            if (Node.isCallExpression(parent)) {
                const fnName = parent.getExpression().getText();
                if (allowedFunctions.has(fnName)) {
                    const tempKey = `i$fdw_${tempIdCounter++}`;
                    results.push({ node, placeholders: [], tempKey, text });
                }
            }
        }

        // TEMPLATE LITERALS para alert/confirm/prompt
        if (Node.isTemplateExpression(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
            const parent = node.getParent();
            if (Node.isCallExpression(parent)) {
                const fnName = parent.getExpression().getText();
                if (allowedFunctions.has(fnName)) {
                    const processed = processTemplateLiteral(node);
                    if (processed) {
                        const tempKey = `i$fdw_${tempIdCounter++}`;
                        results.push({ node, placeholders: processed.placeholders, tempKey, text: processed.text });
                    }
                }
            }
        }
    });

    return results;
}
