/**
 * Generate a deterministic, human-readable translation key from text.
 * This is used as a fallback when AI-generated keys are not available.
 */

/**
 * Convert a string to camelCase
 */
function toCamelCase(str: string): string {
  return str
    .replace(/[^\w\s]/g, " ") // Replace special chars with spaces
    .replace(/_/g, " ") // Replace underscores with spaces
    .split(/\s+/) // Split by whitespace
    .filter(Boolean) // Remove empty strings
    .map((word, index) => {
      const lower = word.toLowerCase();
      return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}

/**
 * Generate a deterministic key from text.
 * 
 * Rules:
 * - Remove special characters
 * - Convert to camelCase
 * - Limit to first 4-5 words for readability
 * - Ensure minimum length
 * 
 * @param text - The text to generate a key from
 * @returns A camelCase key
 */
export function generateKey(text: string): string {
  // Remove template literal placeholders like {name}
  const cleanedText = text.replace(/\{[^}]+\}/g, "");
  
  // Replace apostrophes followed by 's' with just 's' (e.g., "User's" -> "Users")
  const normalizedText = cleanedText.replace(/'s\b/g, "s");
  
  // Split into words and take first 4-5 significant words
  const words = normalizedText
    .replace(/[^\w\s]/g, " ")
    .replace(/_/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5);
  
  if (words.length === 0) {
    return "text";
  }
  
  const key = toCamelCase(words.join(" "));
  
  // Ensure minimum key length
  if (key.length < 3) {
    return "text";
  }
  
  return key;
}

/**
 * Generate a unique key by appending a counter if needed.
 * 
 * @param baseKey - The base key
 * @param existingKeys - Set of already used keys
 * @returns A unique key
 */
export function generateUniqueKey(baseKey: string, existingKeys: Set<string>): string {
  if (!existingKeys.has(baseKey)) {
    return baseKey;
  }
  
  let counter = 2;
  let uniqueKey = `${baseKey}${counter}`;
  
  while (existingKeys.has(uniqueKey)) {
    counter++;
    uniqueKey = `${baseKey}${counter}`;
  }
  
  return uniqueKey;
}
