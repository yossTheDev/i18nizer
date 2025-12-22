interface PromptOptions {
  componentName: string;
  locales: string[];
  texts: string[];
}

export function buildPrompt({
  componentName,
  locales,
  texts,
}: PromptOptions) {
  return `
You are an i18n automation tool.

TASK:
Generate translation keys and translations for a React component.

RULES:
- Keys must be camelCase
- Namespace must be "${componentName}"
- Languages: ${locales.join(", ")}
- Do NOT invent or modify meaning
- Do NOT add explanations
- Do NOT add markdown
- Output ONLY valid JSON

FORMAT EXACTLY:
{
  "${componentName}": {
    "keyName": {
      "${locales[0]}": "...",
      "${locales[1]}": "..."
    }
  }
}

TEXTS:
${texts.map((t) => `"${t}"`).join("\n")}
`.trim();
}
