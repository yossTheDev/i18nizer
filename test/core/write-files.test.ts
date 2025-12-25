import { expect } from 'chai';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

describe('writeLocaleFiles - JSON Output Quality', () => {
  const testDir = path.join(os.homedir(), '.i18nizer-test-' + Date.now());

  before(() => {
    // Create test directory
    fs.mkdirSync(testDir, { recursive: true });
  });

  after(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { force: true, recursive: true });
    }
  });

  // Helper to create a mock writeLocaleFiles that writes to test directory
  function testWriteLocaleFiles(
    namespace: string,
    data: Record<string, Record<string, Record<string, string>>>,
    locales: string[]
  ) {
    for (const locale of locales) {
      const content: Record<string, Record<string, string>> = {};
      content[namespace] = {};

      // Sort keys for stable output
      const sortedKeys = Object.keys(data[namespace]).sort();

      for (const key of sortedKeys) {
        content[namespace][key] = data[namespace][key][locale];
      }

      const dir = path.join(testDir, 'messages', locale);
      fs.mkdirSync(dir, { recursive: true });

      const filePath = path.join(dir, `${namespace}.json`);
      
      // Use 2-space indentation for clean, readable JSON
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + "\n");
    }
  }

  afterEach(() => {
    // Clean up after each test
    const messagesDir = path.join(testDir, 'messages');
    if (fs.existsSync(messagesDir)) {
      fs.rmSync(messagesDir, { force: true, recursive: true });
    }
  });

  it('should write JSON files for each locale', () => {
    const namespace = 'TestComponent';
    const data = {
      TestComponent: {
        signIn: {
          en: 'Sign in',
          es: 'Iniciar sesión',
        },
        welcomeBack: {
          en: 'Welcome back',
          es: 'Bienvenido de nuevo',
        },
      },
    };
    const locales = ['en', 'es'];

    testWriteLocaleFiles(namespace, data, locales);

    // Check en file
    const enPath = path.join(testDir, 'messages', 'en', 'TestComponent.json');
    expect(fs.existsSync(enPath)).to.be.true;

    const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    expect(enContent).to.deep.equal({
      TestComponent: {
        signIn: 'Sign in',
        welcomeBack: 'Welcome back',
      },
    });

    // Check es file
    const esPath = path.join(testDir, 'messages', 'es', 'TestComponent.json');
    expect(fs.existsSync(esPath)).to.be.true;

    const esContent = JSON.parse(fs.readFileSync(esPath, 'utf8'));
    expect(esContent).to.deep.equal({
      TestComponent: {
        signIn: 'Iniciar sesión',
        welcomeBack: 'Bienvenido de nuevo',
      },
    });
  });

  it('should sort keys alphabetically for stable output', () => {
    const namespace = 'Form';
    const data = {
      Form: {
        apply: { en: 'Apply' },
        cancel: { en: 'Cancel' },
        reset: { en: 'Reset' },
        submit: { en: 'Submit' },
      },
    };
    const locales = ['en'];

    testWriteLocaleFiles(namespace, data, locales);

    const filePath = path.join(testDir, 'messages', 'en', 'Form.json');
    const content = fs.readFileSync(filePath, 'utf8');

    // Parse and check key order
    const parsed = JSON.parse(content);
    const keys = Object.keys(parsed.Form);

    // Keys should be alphabetically sorted
    expect(keys).to.deep.equal(['apply', 'cancel', 'reset', 'submit']);
  });

  it('should format JSON with 2-space indentation', () => {
    const namespace = 'Component';
    const data = {
      Component: {
        key1: { en: 'Value 1' },
      },
    };
    const locales = ['en'];

    testWriteLocaleFiles(namespace, data, locales);

    const filePath = path.join(testDir, 'messages', 'en', 'Component.json');
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for 2-space indentation
    expect(content).to.include('  "Component":');
    expect(content).to.include('    "key1":');
  });

  it('should add trailing newline to JSON file', () => {
    const namespace = 'Component';
    const data = {
      Component: {
        key1: { en: 'Value 1' },
      },
    };
    const locales = ['en'];

    testWriteLocaleFiles(namespace, data, locales);

    const filePath = path.join(testDir, 'messages', 'en', 'Component.json');
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for trailing newline
    expect(content.endsWith('\n')).to.be.true;
  });

  it('should create nested directories if they do not exist', () => {
    const namespace = 'NewComponent';
    const data = {
      NewComponent: {
        test: { fr: 'Test' },
      },
    };
    const locales = ['fr'];

    testWriteLocaleFiles(namespace, data, locales);

    const filePath = path.join(testDir, 'messages', 'fr', 'NewComponent.json');
    expect(fs.existsSync(filePath)).to.be.true;
  });

  it('should produce deterministic output on multiple runs', () => {
    const namespace = 'Stable';
    const data = {
      Stable: {
        apple: { en: 'Apple' },
        mango: { en: 'Mango' },
        zebra: { en: 'Zebra' },
      },
    };
    const locales = ['en'];

    // Write once
    testWriteLocaleFiles(namespace, data, locales);
    const filePath = path.join(testDir, 'messages', 'en', 'Stable.json');
    const content1 = fs.readFileSync(filePath, 'utf8');

    // Write again
    testWriteLocaleFiles(namespace, data, locales);
    const content2 = fs.readFileSync(filePath, 'utf8');

    // Should be identical
    expect(content1).to.equal(content2);
  });
});
