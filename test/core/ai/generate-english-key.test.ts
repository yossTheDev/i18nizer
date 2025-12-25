import { expect } from "chai";

import { generateEnglishKey } from "../../../src/core/ai/generate-english-key.js";

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
});
