import { expect } from "chai";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { TranslationCache } from "../../../src/core/cache/translation-cache.js";
import { Deduplicator } from "../../../src/core/deduplication/deduplicator.js";

describe("Deduplicator", () => {
  let testDir: string;
  let cache: TranslationCache;

  beforeEach(() => {
    // Create a temp directory for each test
    testDir = path.join(os.tmpdir(), `i18nizer-test-${Date.now()}`);
    fs.mkdirSync(testDir, { recursive: true });
    cache = new TranslationCache(testDir);
  });

  afterEach(() => {
    // Clean up test directory
    fs.rmSync(testDir, { force: true, recursive: true });
  });

  describe("deduplicate with AI disabled", () => {
    it("should generate deterministic keys from text", async () => {
      const deduplicator = new Deduplicator(cache, false);

      const result = await deduplicator.deduplicate(
        "Welcome back",
        "Login",
        false
      );

      expect(result.key).to.equal("welcomeBack");
      expect(result.isCached).to.be.false;
      expect(result.isReused).to.be.false;
    });

    it("should reuse cached keys when detectDuplicates is true", async () => {
      // Pre-populate cache
      cache.set({
        componentName: "Login",
        key: "welcomeBack",
        locales: { en: "Welcome back" },
        text: "Welcome back",
      });

      const deduplicator = new Deduplicator(cache, false);

      const result = await deduplicator.deduplicate(
        "Welcome back",
        "Login",
        true
      );

      expect(result.key).to.equal("welcomeBack");
      expect(result.isCached).to.be.true;
      expect(result.isReused).to.be.true;
    });

    it("should not reuse cached keys when detectDuplicates is false", async () => {
      // Pre-populate cache
      cache.set({
        componentName: "Login",
        key: "welcomeBack",
        locales: { en: "Welcome back" },
        text: "Welcome back",
      });

      const deduplicator = new Deduplicator(cache, false);

      const result = await deduplicator.deduplicate(
        "Welcome back",
        "Login",
        false
      );

      expect(result.key).to.equal("welcomeBack");
      expect(result.isCached).to.be.false;
      expect(result.isReused).to.be.false;
    });

    it("should generate unique keys for duplicate base keys", async () => {
      const deduplicator = new Deduplicator(cache, false);

      const result1 = await deduplicator.deduplicate("Submit", "Form", false);
      const result2 = await deduplicator.deduplicate("Submit", "Modal", false);

      expect(result1.key).to.equal("submit");
      expect(result2.key).to.equal("submit2");
    });
  });

  describe("deduplicate with AI enabled (using fallback)", () => {
    it("should fall back to deterministic keys when AI fails", async () => {
      // AI will fail in test environment without API keys
      const deduplicator = new Deduplicator(cache, true);

      const result = await deduplicator.deduplicate(
        "Welcome back",
        "Login",
        false
      );

      // Should fall back to deterministic key generation
      expect(result.key).to.equal("welcomeBack");
      expect(result.isCached).to.be.false;
      expect(result.isReused).to.be.false;
    });

    it("should reuse cached keys even with AI enabled", async () => {
      // Pre-populate cache
      cache.set({
        componentName: "Login",
        key: "welcomeBack",
        locales: { en: "Welcome back" },
        text: "Welcome back",
      });

      const deduplicator = new Deduplicator(cache, true);

      const result = await deduplicator.deduplicate(
        "Welcome back",
        "Login",
        true
      );

      expect(result.key).to.equal("welcomeBack");
      expect(result.isCached).to.be.true;
      expect(result.isReused).to.be.true;
    });
  });

  describe("getUsedKeys", () => {
    it("should return all used keys", async () => {
      const deduplicator = new Deduplicator(cache, false);

      await deduplicator.deduplicate("Welcome back", "Login", false);
      await deduplicator.deduplicate("Sign in", "Login", false);

      const usedKeys = deduplicator.getUsedKeys();

      expect(usedKeys.size).to.equal(2);
      expect(usedKeys.has("welcomeBack")).to.be.true;
      expect(usedKeys.has("signIn")).to.be.true;
    });
  });
});
