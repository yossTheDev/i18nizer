import {expect} from 'chai'
import {Project} from 'ts-morph'

import {extractTexts} from '../../../src/core/ast/extract-text.js'

describe('extractTexts', () => {
  it('extracts text from ternary operator in JSX attribute', () => {
    const project = new Project()
    const sourceFile = project.createSourceFile(
      'test.tsx',
      `
      const Component = ({ condition }) => (
        <input placeholder={condition ? "Text A" : "Text B"} />
      );
    `,
    )

    const texts = extractTexts(sourceFile)
    expect(texts).to.have.lengthOf(2)
    expect(texts[0]?.text).to.equal('Text A')
    expect(texts[1]?.text).to.equal('Text B')
  })

  it('extracts text from ternary operator in JSX children', () => {
    const project = new Project()
    const sourceFile = project.createSourceFile(
      'test.tsx',
      `
      const Component = ({ condition }) => (
        <div>{condition ? "Text A" : "Text B"}</div>
      );
    `,
    )

    const texts = extractTexts(sourceFile)
    expect(texts).to.have.lengthOf(2)
    expect(texts[0]?.text).to.equal('Text A')
    expect(texts[1]?.text).to.equal('Text B')
  })

  it('extracts text from logical AND operator in JSX children', () => {
    const project = new Project()
    const sourceFile = project.createSourceFile(
      'test.tsx',
      `
      const Component = ({ condition }) => (
        <div>{condition && "Text is shown"}</div>
      );
    `,
    )

    const texts = extractTexts(sourceFile)
    expect(texts).to.have.lengthOf(1)
    expect(texts[0]?.text).to.equal('Text is shown')
  })

  it('extracts text from logical OR operator in JSX children', () => {
    const project = new Project()
    const sourceFile = project.createSourceFile(
      'test.tsx',
      `
      const Component = ({ condition }) => (
        <div>{condition || "Default text"}</div>
      );
    `,
    )

    const texts = extractTexts(sourceFile)
    expect(texts).to.have.lengthOf(1)
    expect(texts[0]?.text).to.equal('Default text')
  })

  it('extracts text from string literal in curly braces in JSX attribute', () => {
    const project = new Project()
    const sourceFile = project.createSourceFile(
      'test.tsx',
      `
      const Component = () => (
        <input placeholder={"Some text"} />
      );
    `,
    )

    const texts = extractTexts(sourceFile)
    expect(texts).to.have.lengthOf(1)
    expect(texts[0]?.text).to.equal('Some text')
  })

  it('extracts text from nested ternary operators', () => {
    const project = new Project()
    const sourceFile = project.createSourceFile(
      'test.tsx',
      `
      const Component = ({ a, b }) => (
        <input placeholder={a ? "Text A" : b ? "Text B" : "Text C"} />
      );
    `,
    )

    const texts = extractTexts(sourceFile)
    expect(texts).to.have.lengthOf(3)
    expect(texts[0]?.text).to.equal('Text A')
    expect(texts[1]?.text).to.equal('Text B')
    expect(texts[2]?.text).to.equal('Text C')
  })

  it('generates unique tempKeys for each extracted text', () => {
    const project = new Project()
    const sourceFile = project.createSourceFile(
      'test.tsx',
      `
      const Component = ({ condition }) => (
        <div>
          <input placeholder={condition ? "Text A" : "Text B"} />
          <div>{condition && "Text C"}</div>
        </div>
      );
    `,
    )

    const texts = extractTexts(sourceFile)
    expect(texts).to.have.lengthOf(3)
    
    const tempKeys = texts.map(t => t.tempKey)
    const uniqueTempKeys = new Set(tempKeys)
    expect(uniqueTempKeys.size).to.equal(3)
  })

  it('extracts text from simple JSX text nodes', () => {
    const project = new Project()
    const sourceFile = project.createSourceFile(
      'test.tsx',
      `
      const Component = () => (
        <div>Simple text</div>
      );
    `,
    )

    const texts = extractTexts(sourceFile)
    expect(texts).to.have.lengthOf(1)
    expect(texts[0]?.text).to.equal('Simple text')
  })

  it('extracts text from simple placeholder attributes', () => {
    const project = new Project()
    const sourceFile = project.createSourceFile(
      'test.tsx',
      `
      const Component = () => (
        <input placeholder="Enter your name" />
      );
    `,
    )

    const texts = extractTexts(sourceFile)
    expect(texts).to.have.lengthOf(1)
    expect(texts[0]?.text).to.equal('Enter your name')
  })

  it('extracts text from multiple edge cases in one component', () => {
    const project = new Project()
    const sourceFile = project.createSourceFile(
      'test.tsx',
      `
      const Component = ({ state, date }) => (
        <div>
          <input placeholder={state ? "Select a city" : "Please select a state first"} />
          <input placeholder={"Some text"} />
          <div>{date ? format(date, "PPP") : "Select a date"}</div>
          <div>{state && "State is selected"}</div>
          <div>{state || "No state selected"}</div>
        </div>
      );
    `,
    )

    const texts = extractTexts(sourceFile)
    expect(texts).to.have.lengthOf(6)
    expect(texts[0]?.text).to.equal('Select a city')
    expect(texts[1]?.text).to.equal('Please select a state first')
    expect(texts[2]?.text).to.equal('Some text')
    expect(texts[3]?.text).to.equal('Select a date')
    expect(texts[4]?.text).to.equal('State is selected')
    expect(texts[5]?.text).to.equal('No state selected')
  })
})
