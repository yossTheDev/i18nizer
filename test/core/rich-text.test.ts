/* eslint-disable unicorn/consistent-function-scoping */
import { expect } from 'chai';
import { Project, ts } from 'ts-morph';

import { extractTexts } from '../../src/core/ast/extract-text.js';
import { replaceTempKeysWithT } from '../../src/core/ast/replace-text-with-text.js';

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
    it('should detect rich text pattern with single inline element', () => {
      const code = `
        const Component = () => (
          <p>Click <a href="/terms">here</a> to continue</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      // Should extract one rich text entry
      const richTextResult = results.find(r => r.isRichText);
      expect(richTextResult).to.exist;
      expect(richTextResult!.isRichText).to.be.true;
      expect(richTextResult!.text).to.include('<a>here</a>');
      expect(richTextResult!.richTextElements).to.have.lengthOf(1);
      expect(richTextResult!.richTextElements![0].tag).to.equal('a');
      expect(richTextResult!.richTextElements![0].placeholder).to.equal('a');
    });

    it('should detect rich text with Terms of Service pattern', () => {
      const code = `
        const Component = () => (
          <p>By clicking Sign Up, you agree to our <a href="/terms">Terms of Service</a></p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      const richTextResult = results.find(r => r.isRichText);
      expect(richTextResult).to.exist;
      expect(richTextResult!.text).to.include('By clicking Sign Up');
      expect(richTextResult!.text).to.include('<a>Terms of Service</a>');
      expect(richTextResult!.richTextElements).to.have.lengthOf(1);
    });

    it('should detect rich text with strong/bold tags', () => {
      const code = `
        const Component = () => (
          <p>This is <strong>important</strong> text</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      const richTextResult = results.find(r => r.isRichText);
      expect(richTextResult).to.exist;
      expect(richTextResult!.text).to.include('<strong>important</strong>');
      expect(richTextResult!.richTextElements![0].tag).to.equal('strong');
    });

    it('should detect rich text with multiple inline elements', () => {
      const code = `
        const Component = () => (
          <p>Read our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a></p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      const richTextResult = results.find(r => r.isRichText);
      expect(richTextResult).to.exist;
      expect(richTextResult!.text).to.include('<a>Privacy Policy</a>');
      expect(richTextResult!.text).to.include('<a>Terms</a>');
      // Should have unique elements (just 'a' placeholder)
      expect(richTextResult!.richTextElements).to.have.lengthOf(1);
    });

    it('should not detect rich text for elements with only text', () => {
      const code = `
        const Component = () => (
          <p>Just plain text here</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      const richTextResults = results.filter(r => r.isRichText);
      expect(richTextResults).to.have.lengthOf(0);
    });

    it('should not detect rich text for elements with only child elements', () => {
      const code = `
        const Component = () => (
          <div><span>Child 1</span><span>Child 2</span></div>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      // The div shouldn't be detected as rich text (no mixed content at that level)
      const divRichText = results.find(r => r.isRichText && r.text.includes('Child 1') && r.text.includes('Child 2'));
      expect(divRichText).to.not.exist;
    });
  });

  describe('Rich text replacement', () => {
    it('should replace rich text with t.rich() call', () => {
      const code = `
        const Component = () => (
          <p>Click <a href="/terms">here</a> to continue</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      const richTextResult = results.find(r => r.isRichText)!;
      replaceTempKeysWithT([
        {
          isRichText: richTextResult.isRichText,
          key: 'clickHereToContinue',
          node: richTextResult.node,
          placeholders: richTextResult.placeholders,
          richTextElements: richTextResult.richTextElements,
          tempKey: richTextResult.tempKey,
        },
      ]);

      const updatedCode = sourceFile.getText();
      expect(updatedCode).to.include('t.rich("clickHereToContinue"');
      expect(updatedCode).to.include('a: (chunks) => <a>{chunks}</a>');
      expect(updatedCode).to.not.include('Click <a href="/terms">here</a> to continue');
    });

    it('should handle Terms of Service pattern', () => {
      const code = `
        const Component = () => (
          <p>By clicking Sign Up, you agree to our <a href="/terms">Terms of Service</a></p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      const richTextResult = results.find(r => r.isRichText)!;
      replaceTempKeysWithT([
        {
          isRichText: richTextResult.isRichText,
          key: 'signUpAgreement',
          node: richTextResult.node,
          placeholders: richTextResult.placeholders,
          richTextElements: richTextResult.richTextElements,
          tempKey: richTextResult.tempKey,
        },
      ]);

      const updatedCode = sourceFile.getText();
      expect(updatedCode).to.include('t.rich("signUpAgreement"');
      expect(updatedCode).to.include('a: (chunks) => <a>{chunks}</a>');
    });

    it('should handle strong tags', () => {
      const code = `
        const Component = () => (
          <p>This is <strong>important</strong> message</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      const richTextResult = results.find(r => r.isRichText)!;
      replaceTempKeysWithT([
        {
          isRichText: richTextResult.isRichText,
          key: 'importantMessage',
          node: richTextResult.node,
          placeholders: richTextResult.placeholders,
          richTextElements: richTextResult.richTextElements,
          tempKey: richTextResult.tempKey,
        },
      ]);

      const updatedCode = sourceFile.getText();
      expect(updatedCode).to.include('t.rich("importantMessage"');
      expect(updatedCode).to.include('strong: (chunks) => <strong>{chunks}</strong>');
    });
  });

  describe('Rich text integration', () => {
    it('should preserve attributes when replacing', () => {
      const code = `
        const Component = () => (
          <div className="notice">
            <p>Read <a href="/docs">documentation</a> for help</p>
          </div>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      const richTextResult = results.find(r => r.isRichText)!;
      expect(richTextResult).to.exist;
      
      replaceTempKeysWithT([
        {
          isRichText: richTextResult.isRichText,
          key: 'readDocsForHelp',
          node: richTextResult.node,
          placeholders: richTextResult.placeholders,
          richTextElements: richTextResult.richTextElements,
          tempKey: richTextResult.tempKey,
        },
      ]);

      const updatedCode = sourceFile.getText();
      // The parent div should still have its className
      expect(updatedCode).to.include('className="notice"');
      // The p tag should be replaced with t.rich call
      expect(updatedCode).to.include('t.rich("readDocsForHelp"');
    });
  });
});
