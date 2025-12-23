import { Node } from "ts-morph";

let tempIdCounter = 0;

const allowedFunctions = new Set(["alert", "confirm", "prompt"]);
const allowedMemberFunctions = new Set(["toast.error", "toast.info", "toast.success", "toast.warn"]);

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

export function extractTexts(sourceFile: Node): ExtractedText[] {
    const results: ExtractedText[] = [];

    // eslint-disable-next-line complexity
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

            const allowedProps = ["placeholder", "title", "alt", "aria-label"];
            if (Node.isJsxAttribute(parent) && allowedProps.includes(parent.getNameNode().getText())) {
                const tempKey = `i$fdw_${tempIdCounter++}`;
                results.push({ node, placeholders: [], tempKey, text });
            }

            if (Node.isCallExpression(parent)) {
                const fnName = getFullCallName(parent.getExpression());
                if (fnName && (allowedFunctions.has(fnName) || allowedMemberFunctions.has(fnName))) {
                    const tempKey = `i$fdw_${tempIdCounter++}`;
                    results.push({ node, placeholders: [], tempKey, text });
                }
            }
        }

        if (Node.isTemplateExpression(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
            const parent = node.getParent();
            if (Node.isCallExpression(parent)) {
                const fnName = getFullCallName(parent.getExpression());
                if (fnName && (allowedFunctions.has(fnName) || allowedMemberFunctions.has(fnName))) {
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
