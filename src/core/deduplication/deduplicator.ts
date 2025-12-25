import { Provider } from "../ai/client.js";
import { generateEnglishKeysBatch } from "../ai/generate-english-key.js";
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
 * Statistics about the deduplication process
 */
export interface DeduplicationStats {
  totalStrings: number;
  uniqueStrings: number;
  cacheHits: number;
  aiRequestsUsed: number;
}

/**
 * Deduplicate strings and assign deterministic keys
 */
export class Deduplicator {
  private cache: TranslationCache;
  private provider: Provider;
  private useAiForKeys: boolean;
  private usedKeys = new Set<string>();
  private seenTexts = new Set<string>(); // Track all texts seen across all batches
  private stats: DeduplicationStats = {
    aiRequestsUsed: 0,
    cacheHits: 0,
    totalStrings: 0,
    uniqueStrings: 0,
  };

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
   * Process multiple texts in batch and return deterministic keys
   * This is the preferred method for efficiency with AI
   */
  async deduplicateBatch(
    texts: string[],
    componentName: string,
    detectDuplicates: boolean
  ): Promise<Map<string, DeduplicationResult>> {
    this.stats.totalStrings += texts.length;

    const results = new Map<string, DeduplicationResult>();
    const uncachedTexts: string[] = [];

    // First pass: check cache and collect uncached texts
    for (const text of texts) {
      const cached = this.cache.get(text);

      if (cached && detectDuplicates) {
        // Reuse existing key from cache
        this.usedKeys.add(cached.key);
        results.set(text, {
          isCached: true,
          isReused: true,
          key: cached.key,
        });
        this.stats.cacheHits++;
      } else {
        uncachedTexts.push(text);
      }
    }

    // Track unique strings across all batches
    for (const text of texts) {
      if (!this.seenTexts.has(text)) {
        this.seenTexts.add(text);
        this.stats.uniqueStrings++;
      }
    }

    // Second pass: generate keys for uncached texts
    if (uncachedTexts.length > 0) {
      let aiKeyMap = new Map<string, string>();

      if (this.useAiForKeys) {
        // Batch AI request for all uncached texts
        aiKeyMap = await generateEnglishKeysBatch(uncachedTexts, this.provider);
        if (aiKeyMap.size > 0) {
          this.stats.aiRequestsUsed++;
        }
      }

      // Generate keys for remaining uncached texts
      for (const text of uncachedTexts) {
        const aiKey = aiKeyMap.get(text);
        const baseKey = aiKey ?? generateKey(text);
        const uniqueKey = generateUniqueKey(baseKey, this.usedKeys);
        this.usedKeys.add(uniqueKey);

        results.set(text, {
          isCached: false,
          isReused: false,
          key: uniqueKey,
        });
      }
    }

    return results;
  }

  /**
   * Process a single text and return a deterministic key
   * Reuses existing keys if the text was seen before
   * 
   * @deprecated Use deduplicateBatch for better efficiency. This method will be
   * removed in v1.0. To migrate, collect texts and call deduplicateBatch once:
   * 
   * @example
   * // Before:
   * const result1 = await deduplicator.deduplicate(text1, comp, true);
   * const result2 = await deduplicator.deduplicate(text2, comp, true);
   * 
   * // After:
   * const results = await deduplicator.deduplicateBatch([text1, text2], comp, true);
   * const result1 = results.get(text1);
   * const result2 = results.get(text2);
   */
  async deduplicate(
    text: string,
    componentName: string,
    detectDuplicates: boolean
  ): Promise<DeduplicationResult> {
    // Use batch method with single item for consistency
    const results = await this.deduplicateBatch([text], componentName, detectDuplicates);
    return results.get(text)!;
  }

  /**
   * Get all used keys
   */
  getUsedKeys(): Set<string> {
    return new Set(this.usedKeys);
  }

  /**
   * Get deduplication statistics
   */
  getStats(): DeduplicationStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      aiRequestsUsed: 0,
      cacheHits: 0,
      totalStrings: 0,
      uniqueStrings: 0,
    };
    this.seenTexts.clear();
  }
}
