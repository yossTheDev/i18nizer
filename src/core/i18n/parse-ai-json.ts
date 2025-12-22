export function parseAiJson(raw: string) {
    const cleaned = raw
        .replaceAll('```json', "")
        .replaceAll('```', "")
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch {
        throw new Error("Gemini did not return valid JSON");
    }
}
