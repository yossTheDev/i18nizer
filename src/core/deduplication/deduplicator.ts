import { Provider } from "../ai/client.js";
import { generateEnglishKey } from "../ai/generate-english-key.js";
import { TranslationCache } from "../cache/translation-cache.js";
import { generateKey, generateUniqueKey } from "../i18n/generate-key.js";

/**
 * Represents a string that needs translation
 */
export interface TranslationString {
  componentName: string;
  tempKey: string;
  text: string;
}

/**
 * Result of deduplication
 */
export interface DeduplicationResult {
  isCached: boolean; // Whether translation was cached
  isReused: boolean; // Whether this key was reused from cache
  key: string; // The final key to use
}

/**
 * Deduplicate strings and assign deterministic keys
 */
export class Deduplicator {
  private cache: TranslationCache;
  private provider: Provider;
  private useAiForKeys: boolean;
  private usedKeys = new Set<string>();

  constructor(
    cache: TranslationCache,
    useAiForKeys: boolean = true,
    provider: Provider = "huggingface"
  ) {
    this.cache = cache;
    this.provider = provider;
    this.useAiForKeys = useAiForKeys;
  }

  /**
   * Process a text and return a deterministic key
   * Reuses existing keys if the text was seen before
   */
  async deduplicate(
    text: string,
    componentName: string,
    detectDuplicates: boolean
  ): Promise<DeduplicationResult> {
    // Check cache first
    const cached = this.cache.get(text);

    if (cached && detectDuplicates) {
      // Reuse existing key from cache
      this.usedKeys.add(cached.key);
      return {
        isCached: true,
        isReused: true,
        key: cached.key,
      };
    }

    // Generate a new deterministic key
    let baseKey: string;

    if (this.useAiForKeys && !cached) {
      // Try to generate English key using AI
      const aiKey = await generateEnglishKey(text, this.provider);
      baseKey = aiKey ?? generateKey(text);
    } else {
      // Use deterministic key generation (fallback or when AI is disabled)
      baseKey = generateKey(text);
    }

    const uniqueKey = generateUniqueKey(baseKey, this.usedKeys);
    this.usedKeys.add(uniqueKey);

    return {
      isCached: false,
      isReused: false,
      key: uniqueKey,
    };
  }

  /**
   * Get all used keys
   */
  getUsedKeys(): Set<string> {
    return new Set(this.usedKeys);
  }
}
