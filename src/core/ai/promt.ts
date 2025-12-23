interface PromptOptions {
  componentName: string;
  locales: string[];
  texts: { tempKey: string; text: string }[];
}

export function buildPrompt({ componentName, locales, texts }: PromptOptions) {
  return `
You are an i18n automation tool for React components.

TASK:
Generate concise and meaningful translation keys in camelCase for a React component.

RULES:
- For each provided tempKey, generate a meaningful **camelCase English key** suitable for i18n.
- Keys should be concise, ideally 3-4 words maximum, even if the text is a full sentence.
- Keep the tempKey in the output so it can be mapped to JSX nodes.
- Include translations for all requested languages: ${locales.join(", ")}
- Namespace must be "${componentName}"
- Output ONLY valid JSON
- Do NOT include explanations, comments, markdown, or extra text

FORMAT EXACTLY:
{
  "${componentName}": {
    "tempKey": {
      "key": "conciseCamelCaseKey",
      ${locales.map(l => `"${l}": "..."`).join(",\n      ")}
    }
  }
}

TEXTS TO TRANSLATE (format: "tempKey: text"):
${texts
      .map(
        t =>
          `"${t.tempKey}": "${t.text
            .replaceAll('"', String.raw`\"`)
            .replaceAll(/\r?\n/g, " ")}"`
      )
      .join("\n")}

EXAMPLE:
"i$abc_0": { "key": "profileTitle", "en": "Profile Settings Title", "es": "Título de la Configuración del Perfil" }
`.trim();
}