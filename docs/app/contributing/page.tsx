import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contributing',
  description: 'Learn how to contribute to i18nizer - setup, development workflow, and contribution guidelines',
}

export default function Contributing() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <h1>Contributing</h1>
      
      <p>
        We welcome contributions to i18nizer! This guide will help you get started
        with development and understand our contribution workflow.
      </p>

      <h2>Getting Started</h2>

      <h3>Prerequisites</h3>
      <ul>
        <li>Node.js 18 or higher</li>
        <li>Yarn (v4.12.0 or compatible)</li>
        <li>Git</li>
        <li>A code editor (VS Code recommended)</li>
      </ul>

      <h3>Clone the Repository</h3>
      <pre><code className="language-bash">{`git clone https://github.com/yossTheDev/i18nizer.git
cd i18nizer`}</code></pre>

      <h3>Install Dependencies</h3>
      <pre><code className="language-bash">yarn install</code></pre>

      <h3>Build the Project</h3>
      <pre><code className="language-bash">yarn build</code></pre>

      <h3>Run Tests</h3>
      <pre><code className="language-bash">yarn test</code></pre>

      <h3>Run the CLI Locally</h3>
      <p>You can run i18nizer locally without installing it globally:</p>
      
      <pre><code className="language-bash">{`# On Unix/Linux/macOS
./bin/dev.js translate src/component.tsx

# On Windows
.\\bin\\dev.cmd translate src\\component.tsx`}</code></pre>

      <h2>Project Structure</h2>

      <pre><code>{`i18nizer/
├── src/
│   ├── commands/           # CLI command implementations
│   │   ├── start.ts       # Initialize project
│   │   ├── translate.ts   # Main translation command
│   │   ├── extract.ts     # Legacy extraction
│   │   ├── keys.ts        # API key management
│   │   └── regenerate.ts  # Aggregator regeneration
│   ├── core/
│   │   ├── ast/           # AST parsing & transformation
│   │   ├── ai/            # AI provider integrations
│   │   └── i18n/          # JSON generation
│   ├── types/             # TypeScript definitions
│   └── index.ts
├── test/                  # Test files (mirrors src/)
├── bin/                   # Executable scripts
│   ├── dev.js            # Development executable
│   ├── dev.cmd           # Windows dev script
│   └── run.js            # Production executable
├── package.json
├── tsconfig.json
└── README.md`}</code></pre>

      <h2>Development Workflow</h2>

      <h3>1. Create a Branch</h3>
      <pre><code className="language-bash">{`git checkout -b feature/my-new-feature
# or
git checkout -b fix/bug-description`}</code></pre>

      <h3>2. Make Your Changes</h3>
      <p>Edit the relevant files in <code>src/</code>. Follow the existing code style and patterns.</p>

      <h3>3. Add Tests</h3>
      <p>
        Tests are located in <code>test/</code> and mirror the <code>src/</code> structure.
        Always add tests for new features or bug fixes.
      </p>

      <pre><code className="language-bash">{`# Run tests
yarn test

# Run tests in watch mode
yarn test --watch`}</code></pre>

      <h3>4. Lint Your Code</h3>
      <pre><code className="language-bash">yarn lint</code></pre>

      <h3>5. Build and Test Locally</h3>
      <pre><code className="language-bash">{`yarn build
./bin/dev.js translate path/to/test-file.tsx --dry-run`}</code></pre>

      <h3>6. Commit Your Changes</h3>
      <p>Use clear, descriptive commit messages:</p>
      <pre><code className="language-bash">{`git add .
git commit -m "feat: add support for Vue components"
# or
git commit -m "fix: handle empty translation strings correctly"`}</code></pre>

      <p>We follow conventional commit messages:</p>
      <ul>
        <li><code>feat:</code> - New features</li>
        <li><code>fix:</code> - Bug fixes</li>
        <li><code>docs:</code> - Documentation changes</li>
        <li><code>test:</code> - Test additions or modifications</li>
        <li><code>refactor:</code> - Code refactoring</li>
        <li><code>chore:</code> - Build process or auxiliary tool changes</li>
      </ul>

      <h3>7. Push and Create a Pull Request</h3>
      <pre><code className="language-bash">{`git push origin feature/my-new-feature`}</code></pre>

      <p>Then open a pull request on GitHub with:</p>
      <ul>
        <li>Clear description of the changes</li>
        <li>Related issue numbers (if applicable)</li>
        <li>Screenshots or examples (if UI-related)</li>
        <li>Test results</li>
      </ul>

      <h2>Code Style Guidelines</h2>

      <h3>TypeScript</h3>
      <ul>
        <li>Always use TypeScript, no plain JavaScript</li>
        <li>Follow the ESLint rules defined in <code>eslint.config.mjs</code></li>
        <li>Use type annotations for function parameters and return values</li>
        <li>Prefer <code>interface</code> over <code>type</code> for object shapes</li>
      </ul>

      <h3>Naming Conventions</h3>
      <ul>
        <li>Files: camelCase (<code>extractStrings.ts</code>)</li>
        <li>Classes: PascalCase (<code>ASTParser</code>)</li>
        <li>Functions: camelCase (<code>generateKey</code>)</li>
        <li>Constants: UPPER_SNAKE_CASE (<code>DEFAULT_LOCALE</code>)</li>
      </ul>

      <h3>Comments</h3>
      <ul>
        <li>Add JSDoc comments for public APIs</li>
        <li>Use inline comments sparingly, prefer self-documenting code</li>
        <li>Document complex algorithms or non-obvious logic</li>
      </ul>

      <h2>Testing Guidelines</h2>

      <h3>Unit Tests</h3>
      <p>Located in <code>test/</code>, using Mocha and Chai:</p>
      <pre><code className="language-typescript">{`import { expect } from 'chai'
import { generateKey } from '../src/core/i18n/key-generator'

describe('generateKey', () => {
  it('should generate camelCase key from text', () => {
    const result = generateKey('Hello World')
    expect(result).to.equal('helloWorld')
  })

  it('should handle special characters', () => {
    const result = generateKey('Hello, World!')
    expect(result).to.equal('helloWorld')
  })
})`}</code></pre>

      <h3>Integration Tests</h3>
      <p>Test complete workflows:</p>
      <pre><code className="language-typescript">{`describe('translate command', () => {
  it('should extract and translate a component', async () => {
    // Setup test file
    // Run translation
    // Verify output
  })
})`}</code></pre>

      <h2>Adding New Features</h2>

      <h3>New AI Provider</h3>
      <ol>
        <li>Create provider client in <code>src/core/ai/</code></li>
        <li>Implement the provider interface</li>
        <li>Add configuration options</li>
        <li>Update documentation</li>
        <li>Add tests</li>
      </ol>

      <h3>New Command</h3>
      <ol>
        <li>Create command file in <code>src/commands/</code></li>
        <li>Extend <code>Command</code> from <code>@oclif/core</code></li>
        <li>Implement <code>run()</code> method</li>
        <li>Add flags and arguments</li>
        <li>Update help text</li>
        <li>Add tests</li>
      </ol>

      <h3>New Extraction Pattern</h3>
      <ol>
        <li>Update AST visitor in <code>src/core/ast/</code></li>
        <li>Add extraction logic</li>
        <li>Handle edge cases</li>
        <li>Add comprehensive tests</li>
      </ol>

      <h2>Pull Request Guidelines</h2>

      <h3>Before Submitting</h3>
      <ul>
        <li>✅ All tests pass (<code>yarn test</code>)</li>
        <li>✅ Code is linted (<code>yarn lint</code>)</li>
        <li>✅ Build succeeds (<code>yarn build</code>)</li>
        <li>✅ Documentation is updated (if needed)</li>
        <li>✅ Commit messages follow conventions</li>
      </ul>

      <h3>PR Description Template</h3>
      <pre><code className="language-markdown">{`## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] No breaking changes (or documented if needed)`}</code></pre>

      <h2>Common Development Tasks</h2>

      <h3>Debugging</h3>
      <pre><code className="language-typescript">{`// Add debug logging
import { log } from '@oclif/core'

log('Debug info:', data)`}</code></pre>

      <h3>Testing with Real Projects</h3>
      <ol>
        <li>Build i18nizer: <code>yarn build</code></li>
        <li>Link globally: <code>npm link</code></li>
        <li>Test in another project: <code>i18nizer translate ...</code></li>
        <li>Unlink when done: <code>npm unlink -g i18nizer</code></li>
      </ol>

      <h3>Updating Dependencies</h3>
      <pre><code className="language-bash">{`# Check for outdated packages
yarn outdated

# Update dependencies
yarn upgrade-interactive`}</code></pre>

      <h2>Getting Help</h2>

      <p>If you have questions or need help:</p>
      <ul>
        <li>📖 Read the <a href="/architecture">Architecture</a> documentation</li>
        <li>💬 Open a <a href="https://github.com/yossTheDev/i18nizer/discussions" target="_blank" rel="noopener">Discussion</a> on GitHub</li>
        <li>🐛 Report bugs via <a href="https://github.com/yossTheDev/i18nizer/issues" target="_blank" rel="noopener">Issues</a></li>
        <li>📧 Contact the maintainer: Yoannis Sanchez Soto</li>
      </ul>

      <h2>Code of Conduct</h2>

      <p>
        We are committed to providing a welcoming and inspiring community for all.
        Please be respectful and constructive in all interactions.
      </p>

      <h2>License</h2>

      <p>
        By contributing to i18nizer, you agree that your contributions will be
        licensed under the MIT License.
      </p>

      <h2>Thank You!</h2>

      <p>
        Thank you for considering contributing to i18nizer. Every contribution,
        no matter how small, helps make the project better! 🎉
      </p>
    </div>
  )
}
