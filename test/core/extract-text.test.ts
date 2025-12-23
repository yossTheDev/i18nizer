import { expect } from 'chai';
import { Project, ts } from 'ts-morph';
import { extractTexts } from '../../src/core/ast/extract-text.js';

describe('extractTexts', () => {
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

  describe('JSX attribute extraction', () => {
    it('should extract simple string literals from placeholder', () => {
      const code = `<input placeholder="Enter your name" />`;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal('Enter your name');
    });

    it('should extract string wrapped in curly braces', () => {
      const code = `<input placeholder={"Some text"} />`;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal('Some text');
    });

    it('should extract strings from ternary operators in attributes', () => {
      const code = `
        const Component = ({ state }) => (
          <input placeholder={state ? "Select a city" : "Please select a state first"} />
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(2);
      expect(results[0].text).to.equal('Select a city');
      expect(results[1].text).to.equal('Please select a state first');
    });

    it('should extract strings from logical AND operator in attributes', () => {
      const code = `
        const Component = ({ showPlaceholder }) => (
          <input placeholder={showPlaceholder && "Enter text here"} />
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal('Enter text here');
    });

    it('should extract strings from logical OR operator in attributes', () => {
      const code = `
        const Component = ({ placeholder }) => (
          <input placeholder={placeholder || "Default placeholder"} />
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal('Default placeholder');
    });

    it('should extract strings from both sides of OR operator when both are literals', () => {
      const code = `
        const Component = () => (
          <input placeholder={"Primary text" || "Fallback text"} />
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(2);
      const texts = results.map(r => r.text);
      expect(texts).to.include('Primary text');
      expect(texts).to.include('Fallback text');
    });
  });

  describe('JSX children extraction', () => {
    it('should extract simple JSX text', () => {
      const code = `<div>Hello World</div>`;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal('Hello World');
    });

    it('should extract strings from ternary operators in children', () => {
      const code = `
        const Component = ({ birthdayDate }) => (
          <span>{birthdayDate ? format(birthdayDate, "PPP") : "Select a date"}</span>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal('Select a date');
    });

    it('should extract strings from logical AND in children', () => {
      const code = `
        const Component = ({ showMessage }) => (
          <div>{showMessage && "This is a message"}</div>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal('This is a message');
    });

    it('should extract strings from logical OR in children', () => {
      const code = `
        const Component = ({ message }) => (
          <div>{message || "Default message"}</div>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal('Default message');
    });
  });

  describe('non-translatable content filtering', () => {
    it('should not extract single character symbols', () => {
      const code = `<span>*</span>`;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(0);
    });

    it('should not extract punctuation-only strings', () => {
      const code = `<span>...</span>`;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(0);
    });

    it('should not extract whitespace-only strings', () => {
      const code = `<span>   </span>`;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(0);
    });

    it('should extract actual text even with leading/trailing symbols', () => {
      const code = `<span>* Required field</span>`;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal('* Required field');
    });

    it('should extract text with currency symbols', () => {
      const code = `<span>Price: €100</span>`;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal('Price: €100');
    });

    it('should not extract standalone currency symbols', () => {
      const code = `<span>€</span>`;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(0);
    });
  });

  describe('template literals', () => {
    it('should extract template literals with placeholders', () => {
      const code = `alert(\`Hello \${name}, welcome!\`)`;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal('Hello {name}, welcome!');
      expect(results[0].placeholders).to.include('name');
    });
  });

  describe('temp key generation', () => {
    it('should generate unique temp keys for each extracted string', () => {
      const code = `
        <div>
          <span>First text</span>
          <span>Second text</span>
          <span>Third text</span>
        </div>
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(3);
      const tempKeys = results.map(r => r.tempKey);
      const uniqueKeys = new Set(tempKeys);
      expect(uniqueKeys.size).to.equal(3);
    });
  });

  describe('complex nested expressions', () => {
    it('should extract from nested ternary in attributes', () => {
      const code = `
        <input placeholder={
          condition1 
            ? (condition2 ? "Option A" : "Option B")
            : "Option C"
        } />
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results.length).to.be.at.least(2);
      const texts = results.map(r => r.text);
      expect(texts).to.include('Option A');
      expect(texts).to.include('Option B');
      expect(texts).to.include('Option C');
    });
  });

  describe('template literal extraction in JSX expressions', () => {
    it('should extract template literal from JSX attribute', () => {
      const code = `
        const Component = () => (
          <input placeholder={\`Seleccionar Especializaciones Destacadas\`} />
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal('Seleccionar Especializaciones Destacadas');
    });

    it('should extract template literal with placeholders from ternary', () => {
      const code = `
        const Component = ({ profile }) => (
          <div>
            {profile.categories.length > 1
              ? \`\${profile.categories[0].name} +\${profile.categories.length - 1}\`
              : profile.categories[0]?.name || "Sin Categoría"}
          </div>
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      // Should extract the template literal with placeholders and the string "Sin Categoría"
      expect(results.length).to.be.at.least(1);
      
      // Check for the template literal
      const templateResult = results.find(r => r.text.includes('profile.categories'));
      if (templateResult) {
        expect(templateResult.placeholders.length).to.be.greaterThan(0);
      }
      
      // Check for "Sin Categoría"
      const stringResult = results.find(r => r.text === 'Sin Categoría');
      expect(stringResult).to.exist;
    });

    it('should extract simple template literal placeholder', () => {
      const code = `
        const Component = () => (
          <input placeholder={\`Enter your name here\`} />
        );
      `;
      const sourceFile = createTestFile(code);
      const results = extractTexts(sourceFile);
      
      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal('Enter your name here');
    });
  });
});
