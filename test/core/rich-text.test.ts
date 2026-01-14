/* eslint-disable unicorn/consistent-function-scoping */
import { expect } from 'chai';
import { Project, ts } from 'ts-morph';

import { extractTexts } from '../../src/core/ast/extract-text.js';

describe('Rich Text Support', () => {
  function createTestFile(code: string) {
    const project = new Project({
      compilerOptions: {
        allowJs: true,
        esModuleInterop: true,
        jsx: ts.JsxEmit.React,
        skipLibCheck: true,
        strict: false,
        target: ts.ScriptTarget.ES2022,
      },
      useInMemoryFileSystem: true,
    });
    return project.createSourceFile('test.tsx', code);
  }

  describe('Rich text detection', () => {
    it('should extract text from JSX elements with child elements', () => {
      const code = `
        const Component = () => (
          <p>Click <a href="/terms">here</a> to continue</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      // Should extract "Click " and "to continue" and "here" separately
      expect(results.length).to.be.at.least(2);
    });

    it('should extract text and link text separately', () => {
      const code = `
        const Component = () => (
          <p>By clicking Sign Up, you agree to our <a href="/terms">Terms of Service</a></p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      // Current behavior: extracts text parts separately
      // This documents the current state - users need to manually combine with t.rich()
      const texts = results.map(r => r.text);
      expect(texts).to.include('Terms of Service');
      expect(texts.some(t => t.includes('By clicking'))).to.be.true;
    });

    it('should extract nested element text', () => {
      const code = `
        const Component = () => (
          <div>
            <p>This is <strong>bold</strong> text</p>
          </div>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      const texts = results.map(r => r.text);
      expect(texts).to.include('bold');
      expect(texts.some(t => t.includes('This is'))).to.be.true;
    });
  });

  describe('Rich text usage notes', () => {
    it('documents that rich text requires manual enhancement', () => {
      // This test documents the expected workflow:
      // 1. i18nizer extracts text parts separately
      // 2. Developer identifies the pattern
      // 3. Developer manually refactors to use t.rich() or Trans
      
      const code = `
        const Component = () => (
          <p>Read our <a href="/privacy">Privacy Policy</a> for details</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      // Extracts: "Read our " or similar, "for details" or similar, and "Privacy Policy"
      expect(results.length).to.be.at.least(1);
      
      // After extraction, developer should manually convert to:
      // <p>{t.rich('privacyNotice', {
      //   link: (chunks) => <a href="/privacy">{chunks}</a>
      // })}</p>
    });
  });
});
