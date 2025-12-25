import { generateKey, generateUniqueKey } from "../i18n/generate-key.js";
import { TranslationCache } from "../cache/translation-cache.js";

/**
 * Represents a string that needs translation
 */
export interface TranslationString {
  text: string;
  componentName: string;
  tempKey: string;
}

/**
 * Result of deduplication
 */
export interface DeduplicationResult {
  key: string; // The final key to use
  isReused: boolean; // Whether this key was reused from cache
  isCached: boolean; // Whether translation was cached
}

/**
 * Deduplicate strings and assign deterministic keys
 */
export class Deduplicator {
  private cache: TranslationCache;
  private usedKeys = new Set<string>();

  constructor(cache: TranslationCache) {
    this.cache = cache;
  }

  /**
   * Process a text and return a deterministic key
   * Reuses existing keys if the text was seen before
   */
  deduplicate(
    text: string,
    componentName: string,
    detectDuplicates: boolean
  ): DeduplicationResult {
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
    const baseKey = generateKey(text);
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
