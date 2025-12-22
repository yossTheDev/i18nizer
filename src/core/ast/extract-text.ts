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

        // JSX Expression con TemplateLiteral
        if (Node.isJsxExpression(node)) {
            const expr = node.getExpression();
            if (expr && (Node.isTemplateExpression(expr) || Node.isNoSubstitutionTemplateLiteral(expr))) {
                const processed = processTemplateLiteral(expr);
                if (processed) {
                    const tempKey = `i$fdw_${tempIdCounter++}`;
                    results.push({ node: expr, placeholders: processed.placeholders, tempKey, text: processed.text });
                }
            }
        }

        // STRING LITERALS
        if (Node.isStringLiteral(node)) {
            const text = node.getLiteralText();
            const parent = node.getParent();

            // JSX Attributes permitidos
            const allowedProps = ["placeholder", "title", "alt", "aria-label"];
            if (Node.isJsxAttribute(parent) && allowedProps.includes(parent.getNameNode().getText())) {
                const tempKey = `i$fdw_${tempIdCounter++}`;
                results.push({ node, placeholders: [], tempKey, text });
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
