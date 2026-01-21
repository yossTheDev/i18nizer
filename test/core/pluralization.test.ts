/* eslint-disable unicorn/consistent-function-scoping */
import { expect } from 'chai';
import { Project, ts } from 'ts-morph';

import { extractTexts } from '../../src/core/ast/extract-text.js';
import { replaceTempKeysWithT } from '../../src/core/ast/replace-text-with-text.js';

describe('Pluralization Support', () => {
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

  describe('Pluralization detection', () => {
    it('should detect simple pluralization pattern with count === 1', () => {
      const code = `
        const Component = ({ count }) => (
          <p>{count === 1 ? 'item' : 'items'}</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      expect(results).to.have.lengthOf(1);
      expect(results[0].isPlural).to.be.true;
      expect(results[0].pluralVariable).to.equal('count');
      expect(results[0].pluralForms).to.deep.equal({
        one: 'item',
        other: 'items',
      });
    });

    it('should detect pluralization pattern with 1 === count', () => {
      const code = `
        const Component = ({ count }) => (
          <p>{1 === count ? 'item' : 'items'}</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      expect(results).to.have.lengthOf(1);
      expect(results[0].isPlural).to.be.true;
      expect(results[0].pluralVariable).to.equal('count');
    });

    it('should detect pluralization with == operator', () => {
      const code = `
        const Component = ({ count }) => (
          <p>{count == 1 ? 'item' : 'items'}</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      expect(results).to.have.lengthOf(1);
      expect(results[0].isPlural).to.be.true;
    });

    it('should detect pluralization in JSX attribute', () => {
      const code = `
        const Component = ({ count }) => (
          <button title={count === 1 ? 'item' : 'items'}>Click</button>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      expect(results).to.have.lengthOf(2); // "Click" and the plural pattern
      const pluralResult = results.find(r => r.isPlural);
      expect(pluralResult).to.exist;
      expect(pluralResult!.pluralVariable).to.equal('count');
    });

    it('should detect pluralization with different variable names', () => {
      const code = `
        const Component = ({ items }) => (
          <p>{items === 1 ? 'notification' : 'notifications'}</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      expect(results).to.have.lengthOf(1);
      expect(results[0].isPlural).to.be.true;
      expect(results[0].pluralVariable).to.equal('items');
      expect(results[0].pluralForms).to.deep.equal({
        one: 'notification',
        other: 'notifications',
      });
    });

    it('should not detect non-pluralization ternary patterns', () => {
      const code = `
        const Component = ({ status }) => (
          <p>{status === 'active' ? 'Active' : 'Inactive'}</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      expect(results).to.have.lengthOf(2); // Two separate strings
      expect(results[0].isPlural).to.be.undefined;
      expect(results[1].isPlural).to.be.undefined;
    });

    it('should include plural variable in placeholders', () => {
      const code = `
        const Component = ({ count }) => (
          <p>{count === 1 ? 'item' : 'items'}</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      expect(results[0].placeholders).to.deep.equal(['count']);
    });
  });

  describe('Pluralization replacement', () => {
    it('should replace pluralization pattern with t() call', () => {
      const code = `
        const Component = ({ count }) => (
          <p>{count === 1 ? 'item' : 'items'}</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      replaceTempKeysWithT([
        {
          isPlural: results[0].isPlural,
          key: 'itemsCount',
          node: results[0].node,
          placeholders: results[0].placeholders,
          tempKey: results[0].tempKey,
        },
      ]);

      const updatedCode = sourceFile.getText();
      expect(updatedCode).to.include('t("itemsCount", { count: count })');
      expect(updatedCode).to.not.include('count === 1');
      expect(updatedCode).to.not.include('? \'item\' : \'items\'');
    });

    it('should replace pluralization in JSX attribute', () => {
      const code = `
        const Component = ({ count }) => (
          <button title={count === 1 ? 'item' : 'items'}>Click</button>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      const pluralResult = results.find(r => r.isPlural)!;
      replaceTempKeysWithT([
        {
          isPlural: pluralResult.isPlural,
          key: 'itemsCount',
          node: pluralResult.node,
          placeholders: pluralResult.placeholders,
          tempKey: pluralResult.tempKey,
        },
      ]);

      const updatedCode = sourceFile.getText();
      expect(updatedCode).to.include('title={t("itemsCount", { count: count })}');
    });

    it('should preserve variable name in placeholder', () => {
      const code = `
        const Component = ({ totalItems }) => (
          <p>{totalItems === 1 ? 'item' : 'items'}</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      replaceTempKeysWithT([
        {
          isPlural: results[0].isPlural,
          key: 'itemsCount',
          node: results[0].node,
          placeholders: results[0].placeholders,
          tempKey: results[0].tempKey,
        },
      ]);

      const updatedCode = sourceFile.getText();
      expect(updatedCode).to.include('t("itemsCount", { totalItems: totalItems })');
    });
  });

  describe('Complex pluralization scenarios', () => {
    it('should handle pluralization within larger JSX expression', () => {
      const code = `
        const Component = ({ count }) => (
          <p>You have {count === 1 ? 'item' : 'items'} in your cart</p>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      // Should extract "You have " and the plural pattern
      expect(results.length).to.be.at.least(1);
      const pluralResult = results.find(r => r.isPlural);
      expect(pluralResult).to.exist;
    });

    it('should handle multiple pluralization patterns in same component', () => {
      const code = `
        const Component = ({ items, users }) => (
          <div>
            <p>{items === 1 ? 'item' : 'items'}</p>
            <p>{users === 1 ? 'user' : 'users'}</p>
          </div>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);

      const pluralResults = results.filter(r => r.isPlural);
      expect(pluralResults).to.have.lengthOf(2);
      expect(pluralResults[0].pluralVariable).to.equal('items');
      expect(pluralResults[1].pluralVariable).to.equal('users');
    });
  });
});
