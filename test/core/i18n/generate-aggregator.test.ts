import { expect } from "chai";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { generateAggregator } from "../../../src/core/i18n/generate-aggregator.js";

describe("generateAggregator", () => {
  const testDir = path.join(os.tmpdir(), "i18nizer-aggregator-test-" + Date.now());
  const messagesDir = path.join(testDir, "messages");
  const i18nDir = path.join(testDir, "i18n");

  before(() => {
    // Create test directory structure
    fs.mkdirSync(messagesDir, { recursive: true });
  });

  after(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { force: true, recursive: true });
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (fs.existsSync(messagesDir)) {
      fs.rmSync(messagesDir, { force: true, recursive: true });
    }

    if (fs.existsSync(i18nDir)) {
      fs.rmSync(i18nDir, { force: true, recursive: true });
    }
  });

  it("should generate aggregator with multiple locales and namespaces", () => {
    // Setup: Create test JSON files
    const enDir = path.join(messagesDir, "en");
    const esDir = path.join(messagesDir, "es");

    fs.mkdirSync(enDir, { recursive: true });
    fs.mkdirSync(esDir, { recursive: true });

    // Create common.json for both locales
    fs.writeFileSync(
      path.join(enDir, "common.json"),
      JSON.stringify({
        Button: {
          cancel: "Cancel",
          confirm: "Confirm",
        },
      })
    );

    fs.writeFileSync(
      path.join(esDir, "common.json"),
      JSON.stringify({
        Button: {
          cancel: "Cancelar",
          confirm: "Confirmar",
        },
      })
    );

    // Create auth.json for both locales
    fs.writeFileSync(
      path.join(enDir, "auth.json"),
      JSON.stringify({
        LoginForm: {
          resetPassword: "Reset password",
          submit: "Submit",
        },
      })
    );

    fs.writeFileSync(
      path.join(esDir, "auth.json"),
      JSON.stringify({
        LoginForm: {
          resetPassword: "Restablecer contraseña",
          submit: "Enviar",
        },
      })
    );

    // Generate aggregator
    generateAggregator(messagesDir, i18nDir);

    // Verify file was created
    const outputPath = path.join(i18nDir, "messages.generated.ts");
    expect(fs.existsSync(outputPath)).to.be.true;

    // Read and verify content
    const content = fs.readFileSync(outputPath, "utf8");

    // Check for imports - should use PascalCase identifiers
    expect(content).to.include('import Common_en from "../messages/en/common.json"');
    expect(content).to.include('import Auth_en from "../messages/en/auth.json"');
    expect(content).to.include('import Common_es from "../messages/es/common.json"');
    expect(content).to.include('import Auth_es from "../messages/es/auth.json"');

    // Check for export structure
    expect(content).to.include("export const messages = {");
    expect(content).to.include("en: {");
    expect(content).to.include("es: {");
    expect(content).to.include("...Common_en,");
    expect(content).to.include("...Auth_en,");
    expect(content).to.include("...Common_es,");
    expect(content).to.include("...Auth_es,");
    expect(content).to.include("} as const;");

    // Check for warning comment
    expect(content).to.include("DO NOT EDIT MANUALLY");
  });

  it("should handle hyphenated filenames with valid TypeScript identifiers", () => {
    // Setup: Create test JSON files with hyphenated names
    const enDir = path.join(messagesDir, "en");
    const esDir = path.join(messagesDir, "es");

    fs.mkdirSync(enDir, { recursive: true });
    fs.mkdirSync(esDir, { recursive: true });

    // Create notification-item.json
    fs.writeFileSync(
      path.join(enDir, "notification-item.json"),
      JSON.stringify({
        NotificationItem: {
          title: "New Notification",
          dismiss: "Dismiss",
        },
      })
    );

    fs.writeFileSync(
      path.join(esDir, "notification-item.json"),
      JSON.stringify({
        NotificationItem: {
          title: "Nueva Notificación",
          dismiss: "Descartar",
        },
      })
    );

    // Create collapsible-text.json
    fs.writeFileSync(
      path.join(enDir, "collapsible-text.json"),
      JSON.stringify({
        CollapsibleText: {
          showMore: "Show more",
          showLess: "Show less",
        },
      })
    );

    fs.writeFileSync(
      path.join(esDir, "collapsible-text.json"),
      JSON.stringify({
        CollapsibleText: {
          showMore: "Mostrar más",
          showLess: "Mostrar menos",
        },
      })
    );

    // Generate aggregator
    generateAggregator(messagesDir, i18nDir);

    // Verify file was created
    const outputPath = path.join(i18nDir, "messages.generated.ts");
    expect(fs.existsSync(outputPath)).to.be.true;

    // Read and verify content
    const content = fs.readFileSync(outputPath, "utf8");

    // Check for imports with valid TypeScript identifiers (PascalCase)
    expect(content).to.include('import NotificationItem_en from "../messages/en/notification-item.json"');
    expect(content).to.include('import CollapsibleText_en from "../messages/en/collapsible-text.json"');
    expect(content).to.include('import NotificationItem_es from "../messages/es/notification-item.json"');
    expect(content).to.include('import CollapsibleText_es from "../messages/es/collapsible-text.json"');

    // Check for export structure with valid identifiers
    expect(content).to.include("...NotificationItem_en,");
    expect(content).to.include("...CollapsibleText_en,");
    expect(content).to.include("...NotificationItem_es,");
    expect(content).to.include("...CollapsibleText_es,");

    // Verify no invalid identifiers with hyphens
    expect(content).to.not.include("notification-item_en");
    expect(content).to.not.include("collapsible-text_en");
  });

  it("should handle single locale with multiple namespaces", () => {
    // Setup: Create test JSON files
    const enDir = path.join(messagesDir, "en");
    fs.mkdirSync(enDir, { recursive: true });

    fs.writeFileSync(
      path.join(enDir, "Button.json"),
      JSON.stringify({ Button: { click: "Click" } })
    );

    fs.writeFileSync(
      path.join(enDir, "Form.json"),
      JSON.stringify({ Form: { submit: "Submit" } })
    );

    // Generate aggregator
    generateAggregator(messagesDir, i18nDir);

    // Verify file was created
    const outputPath = path.join(i18nDir, "messages.generated.ts");
    expect(fs.existsSync(outputPath)).to.be.true;

    const content = fs.readFileSync(outputPath, "utf8");

    // Check for imports
    expect(content).to.include('import Button_en from "../messages/en/Button.json"');
    expect(content).to.include('import Form_en from "../messages/en/Form.json"');

    // Check for export structure
    expect(content).to.include("en: {");
    expect(content).to.include("...Button_en,");
    expect(content).to.include("...Form_en,");
  });

  it("should sort locales and files alphabetically", () => {
    // Setup: Create test JSON files in non-alphabetical order
    const frDir = path.join(messagesDir, "fr");
    const enDir = path.join(messagesDir, "en");
    const esDir = path.join(messagesDir, "es");

    fs.mkdirSync(frDir, { recursive: true });
    fs.mkdirSync(enDir, { recursive: true });
    fs.mkdirSync(esDir, { recursive: true });

    fs.writeFileSync(path.join(frDir, "zebra.json"), JSON.stringify({ Zebra: {} }));
    fs.writeFileSync(path.join(enDir, "apple.json"), JSON.stringify({ Apple: {} }));
    fs.writeFileSync(path.join(esDir, "mango.json"), JSON.stringify({ Mango: {} }));

    // Generate aggregator
    generateAggregator(messagesDir, i18nDir);

    const outputPath = path.join(i18nDir, "messages.generated.ts");
    const content = fs.readFileSync(outputPath, "utf8");

    // Find positions of locale declarations
    const enPos = content.indexOf("en: {");
    const esPos = content.indexOf("es: {");
    const frPos = content.indexOf("fr: {");

    // Locales should be in alphabetical order
    expect(enPos).to.be.lessThan(esPos);
    expect(esPos).to.be.lessThan(frPos);
  });

  it("should skip generation when messages directory does not exist", () => {
    const nonExistentDir = path.join(testDir, "nonexistent");
    
    // Should not throw error
    generateAggregator(nonExistentDir, i18nDir);

    // Should not create output file
    const outputPath = path.join(i18nDir, "messages.generated.ts");
    expect(fs.existsSync(outputPath)).to.be.false;
  });

  it("should skip generation when no locale directories found", () => {
    // Create messages dir but no locale subdirectories
    fs.mkdirSync(messagesDir, { recursive: true });
    
    // Should not throw error
    generateAggregator(messagesDir, i18nDir);

    // Should not create output file
    const outputPath = path.join(i18nDir, "messages.generated.ts");
    expect(fs.existsSync(outputPath)).to.be.false;
  });

  it("should skip generation when no JSON files found", () => {
    // Create locale directories but no JSON files
    const enDir = path.join(messagesDir, "en");
    fs.mkdirSync(enDir, { recursive: true });
    
    // Should not throw error
    generateAggregator(messagesDir, i18nDir);

    // Should not create output file
    const outputPath = path.join(i18nDir, "messages.generated.ts");
    expect(fs.existsSync(outputPath)).to.be.false;
  });

  it("should create i18n directory if it does not exist", () => {
    // Setup: Create test JSON files
    const enDir = path.join(messagesDir, "en");
    fs.mkdirSync(enDir, { recursive: true });

    fs.writeFileSync(
      path.join(enDir, "Test.json"),
      JSON.stringify({ Test: { key: "value" } })
    );

    // Generate aggregator (i18nDir does not exist yet)
    generateAggregator(messagesDir, i18nDir);

    // Verify i18n directory was created
    expect(fs.existsSync(i18nDir)).to.be.true;

    // Verify file was created
    const outputPath = path.join(i18nDir, "messages.generated.ts");
    expect(fs.existsSync(outputPath)).to.be.true;
  });
});
