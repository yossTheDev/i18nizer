import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/**
 * Cache entry structure for translated strings
 */
export interface CacheEntry {
  text: string;
  key: string;
  componentName: string;
  locales: Record<string, string>; // locale -> translated text
  hash: string; // hash of the text for quick lookup
}

/**
 * Cache manager for storing and retrieving translated strings
 */
export class TranslationCache {
  private cacheDir: string;
  private cacheFile: string;
  private cache: Map<string, CacheEntry> = new Map();

  constructor(projectDir: string) {
    this.cacheDir = path.join(projectDir, "cache");
    this.cacheFile = path.join(this.cacheDir, "translations.json");
    this.load();
  }

  /**
   * Generate a hash for a text string
   */
  private hash(text: string): string {
    return crypto.createHash("sha256").update(text.trim().toLowerCase()).digest("hex");
  }

  /**
   * Load cache from disk
   */
  private load(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }

    if (fs.existsSync(this.cacheFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(this.cacheFile, "utf8"));
        this.cache = new Map(Object.entries(data));
      } catch {
        // If cache is corrupted, start fresh
        this.cache = new Map();
      }
    }
  }

  /**
   * Save cache to disk
   */
  save(): void {
    const data = Object.fromEntries(this.cache);
    fs.writeFileSync(this.cacheFile, JSON.stringify(data, null, 2), "utf8");
  }

  /**
   * Get a cached entry by text
   */
  get(text: string): CacheEntry | undefined {
    const textHash = this.hash(text);
    return this.cache.get(textHash);
  }

  /**
   * Check if text is cached
   */
  has(text: string): boolean {
    return this.cache.has(this.hash(text));
  }

  /**
   * Set a cache entry
   */
  set(entry: Omit<CacheEntry, "hash">): void {
    const textHash = this.hash(entry.text);
    this.cache.set(textHash, { ...entry, hash: textHash });
  }

  /**
   * Get all cache entries
   */
  getAll(): CacheEntry[] {
    return [...this.cache.values()];
  }

  /**
   * Find duplicate texts across components
   */
  findDuplicates(): Map<string, CacheEntry[]> {
    const duplicates = new Map<string, CacheEntry[]>();

    for (const entry of this.cache.values()) {
      const existing = duplicates.get(entry.text) ?? [];
      existing.push(entry);
      duplicates.set(entry.text, existing);
    }

    // Filter to only keep actual duplicates (2+ components)
    for (const [text, entries] of duplicates.entries()) {
      if (entries.length < 2) {
        duplicates.delete(text);
      }
    }

    return duplicates;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.save();
  }
}
