import { generateTranslations, Provider } from "./client.js";

/**
 * Generate an English camelCase key from text using AI
 * This ensures keys are always in English regardless of source language
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

TEXT: "${text.replaceAll('"', String.raw`\"`)}"

EXAMPLES:
TEXT: "Bienvenido de nuevo" -> welcomeBack
TEXT: "Por favor inicia sesión" -> pleaseSignIn
TEXT: "Enviar formulario" -> submitForm
TEXT: "Seleccionar ciudad" -> selectCity

OUTPUT (key only):`.trim();

  try {
    const response = await generateTranslations(prompt, provider);
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
