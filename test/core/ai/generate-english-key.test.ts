import { expect } from "chai";

import {
  generateEnglishKey,
  generateEnglishKeysBatch,
} from "../../../src/core/ai/generate-english-key.js";

describe("AI English Key Generation", () => {
  describe("generateEnglishKey", () => {
    it("should return undefined when AI is not available (no API keys)", async () => {
      // In test environment without API keys, the function should return undefined
      const key = await generateEnglishKey("Bienvenido de nuevo");

      // Without API keys, we expect undefined as fallback
      expect(key).to.be.undefined;
    });

    // Note: These tests cannot be run without actual API keys
    // They serve as documentation for expected behavior

    it.skip("should generate English camelCase key from Spanish text (requires API key)", async () => {
      const key = await generateEnglishKey("Bienvenido de nuevo");
      expect(key).to.be.a("string");
      expect(key).to.match(/^[a-z][a-zA-Z0-9]*$/);
    });

    it.skip("should generate English camelCase key from French text (requires API key)", async () => {
      const key = await generateEnglishKey("Sélectionner une ville");
      expect(key).to.be.a("string");
      expect(key).to.match(/^[a-z][a-zA-Z0-9]*$/);
    });

    it.skip("should generate English camelCase key from German text (requires API key)", async () => {
      const key = await generateEnglishKey("Formular absenden");
      expect(key).to.be.a("string");
      expect(key).to.match(/^[a-z][a-zA-Z0-9]*$/);
    });
  });

  describe("generateEnglishKeysBatch", () => {
    it("should return empty map when AI is not available (no API keys)", async () => {
      // In test environment without API keys, the function should return empty map
      const keys = await generateEnglishKeysBatch([
        "Bienvenido de nuevo",
        "Por favor inicia sesión",
      ]);

      // Without API keys, we expect empty map
      expect(keys.size).to.equal(0);
    });

    it("should return empty map for empty input", async () => {
      const keys = await generateEnglishKeysBatch([]);
      expect(keys.size).to.equal(0);
    });

    // Note: These tests cannot be run without actual API keys
    // They serve as documentation for expected behavior

    it.skip("should generate English camelCase keys for multiple texts (requires API key)", async () => {
      const keys = await generateEnglishKeysBatch([
        "Bienvenido de nuevo",
        "Por favor inicia sesión",
        "Enviar formulario",
      ]);

      expect(keys.size).to.equal(3);
      expect(keys.get("Bienvenido de nuevo")).to.match(/^[a-z][a-zA-Z0-9]*$/);
      expect(keys.get("Por favor inicia sesión")).to.match(/^[a-z][a-zA-Z0-9]*$/);
      expect(keys.get("Enviar formulario")).to.match(/^[a-z][a-zA-Z0-9]*$/);
    });

    it.skip("should handle mixed language texts (requires API key)", async () => {
      const keys = await generateEnglishKeysBatch([
        "Hello World",
        "Bonjour le monde",
        "Hola Mundo",
      ]);

      expect(keys.size).to.equal(3);
      for (const key of keys.values()) {
        expect(key).to.match(/^[a-z][a-zA-Z0-9]*$/);
      }
    });
  });
});
