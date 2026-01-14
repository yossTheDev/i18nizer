import { generateTranslations, Provider } from "./client.js";

/**
 * Generate English camelCase keys for multiple texts in a single AI request
 * This is the preferred method for efficiency
 * 
 * @param texts - Array of texts to generate keys for
 * @param provider - AI provider to use
 * @returns Map of text to generated key, or empty map on failure
 */
export async function generateEnglishKeysBatch(
  texts: string[],
  provider: Provider = "huggingface"
): Promise<Map<string, string>> {
  if (texts.length === 0) {
    return new Map();
  }

  const prompt = `
You are an i18n key generator. Generate concise, meaningful camelCase keys in English for the following texts.

RULES:
- Output ONLY a JSON object mapping each text to its camelCase key
- Keys should be 2-4 words maximum
- Keys must be in English
- Keys should describe the content/purpose
- Do NOT include explanations, comments, or any other text
- Output format: { "original text": "camelCaseKey" }

TEXTS:
${texts.map((t, i) => `${i + 1}. ${JSON.stringify(t)}`).join("\n")}

EXAMPLES:
{ "Bienvenido de nuevo": "welcomeBack", "Por favor inicia sesión": "pleaseSignIn" }

OUTPUT (JSON only):`.trim();

  try {
    const response = await generateTranslations(prompt, provider, undefined);
    if (!response) return new Map();

    // Extract JSON from response (handle cases where AI adds markdown or extra text)
    let jsonText = response.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\s*\n/, "").replace(/\n```\s*$/, "");
    }

    const parsed = JSON.parse(jsonText) as Record<string, string>;
    const result = new Map<string, string>();

    // Validate and add each key
    for (const [text, key] of Object.entries(parsed)) {
      // Validate it's a valid camelCase identifier
      if (typeof key === "string" && /^[a-z][a-zA-Z0-9]*$/.test(key)) {
        result.set(text, key);
      }
    }

    return result;
  } catch (error) {
    console.error("❌ Error generating English keys with AI:", error);
    return new Map();
  }
}

/**
 * Generate an English camelCase key from text using AI
 * This ensures keys are always in English regardless of source language
 * 
 * @deprecated Use generateEnglishKeysBatch for better efficiency. This method
 * will be removed in a future version. To migrate, collect all texts and call
 * generateEnglishKeysBatch once:
 * 
 * @example
 * // Before:
 * const key1 = await generateEnglishKey(text1);
 * const key2 = await generateEnglishKey(text2);
 * 
 * // After:
 * const keyMap = await generateEnglishKeysBatch([text1, text2]);
 * const key1 = keyMap.get(text1);
 * const key2 = keyMap.get(text2);
 */
export async function generateEnglishKey(
  text: string,
  provider: Provider = "huggingface"
): Promise<string | undefined> {
  const prompt = `
You are an i18n key generator. Generate a concise, meaningful camelCase key in English for the following text.

RULES:
- Output ONLY the camelCase key, nothing else
- Key should be 2-4 words maximum
- Key must be in English
- Key should describe the content/purpose
- Do NOT include quotes, explanations, or any other text

TEXT: ${JSON.stringify(text)}

EXAMPLES:
TEXT: "Bienvenido de nuevo" -> welcomeBack
TEXT: "Por favor inicia sesión" -> pleaseSignIn
TEXT: "Enviar formulario" -> submitForm
TEXT: "Seleccionar ciudad" -> selectCity

OUTPUT (key only):`.trim();

  try {
    const response = await generateTranslations(prompt, provider, undefined);
    if (!response) return undefined;

    // Clean the response - remove quotes, whitespace, and any extra text
    const cleaned = response
      .trim()
      .replaceAll(/["'`]/g, "")
      .replaceAll(/\s+/g, " ")
      .split(/\s+/)[0]; // Take only the first word/token

    // Validate it's a valid camelCase identifier
    if (/^[a-z][a-zA-Z0-9]*$/.test(cleaned)) {
      return cleaned;
    }

    return undefined;
  } catch (error) {
    console.error("❌ Error generating English key with AI:", error);
    return undefined;
  }
}
