interface PromptOptions {
  componentName: string;
  locales: string[];
  texts: string[];
}

export function buildPrompt({ componentName, locales, texts }: PromptOptions) {
  return `
You are an i18n automation tool for React components.

TASK:
Generate translation keys and translations for a React component.

RULES:
- Keys must be camelCase and always in English
- Namespace must be "${componentName}"
- Include translations for all requested languages: ${locales.join(", ")}
- Do NOT invent or modify meaning
- Do NOT include explanations or comments
- Do NOT add markdown or extra text
- Output ONLY valid JSON

FORMAT EXACTLY:
{
  "${componentName}": {
    "keyNameInEnglish": {
      ${locales.map((l) => `"${l}": "..."`).join(",\n      ")}
    }
  }
}

TEXTS TO TRANSLATE:
${texts.map((t) => `"${t}"`).join("\n")}
`.trim();
}
