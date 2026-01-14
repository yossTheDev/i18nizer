import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Architecture',
  description: 'Understanding how i18nizer works under the hood - AST parsing, AI integration, and caching',
}

export default function Architecture() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <h1>Architecture</h1>
      
      <p>
        Understanding how i18nizer works under the hood helps you use it more effectively
        and contribute to its development.
      </p>

      <h2>High-Level Overview</h2>
      
      <p>i18nizer is built as a CLI tool with three main phases:</p>
      <ol>
        <li><strong>Extraction</strong> - Parse JSX/TSX files and extract translatable strings</li>
        <li><strong>Translation</strong> - Generate translations and keys using AI providers</li>
        <li><strong>Transformation</strong> - Rewrite components to use translation functions</li>
      </ol>

      <h2>Core Components</h2>

      <h3>1. Command Layer (src/commands/)</h3>
      <p>
        Entry points for CLI commands built with <a href="https://oclif.io/" target="_blank" rel="noopener">oclif</a>.
        Each command handles user input, validation, and orchestrates core functionality.
      </p>
      
      <ul>
        <li><code>start.ts</code> - Project initialization</li>
        <li><code>translate.ts</code> - Main translation workflow</li>
        <li><code>extract.ts</code> - Legacy extraction command</li>
        <li><code>keys.ts</code> - API key management</li>
        <li><code>regenerate.ts</code> - Aggregator regeneration</li>
      </ul>

      <h3>2. Core Logic (src/core/)</h3>
      <p>The heart of i18nizer's functionality:</p>

      <h4>AST Utilities (src/core/ast/)</h4>
      <p>
        Uses <a href="https://ts-morph.com/" target="_blank" rel="noopener">ts-morph</a> (TypeScript Compiler API wrapper)
        to parse and manipulate TypeScript/JSX files.
      </p>
      <ul>
        <li><strong>Parser</strong> - Converts source code into an Abstract Syntax Tree</li>
        <li><strong>Extractor</strong> - Walks the AST to find translatable strings</li>
        <li><strong>Transformer</strong> - Modifies AST nodes to inject translation calls</li>
      </ul>

      <h4>AI Integration (src/core/ai/)</h4>
      <p>Handles communication with AI providers for translations and key generation.</p>
      <ul>
        <li><strong>OpenAI Client</strong> - GPT-4, GPT-3.5 models</li>
        <li><strong>Gemini Client</strong> - Google's Gemini models</li>
        <li><strong>Hugging Face Client</strong> - Open models like DeepSeek</li>
        <li><strong>Prompt Engineering</strong> - Optimized prompts for translation quality</li>
      </ul>

      <h4>i18n Utilities (src/core/i18n/)</h4>
      <p>Manages JSON file generation, updates, and the aggregator system.</p>
      <ul>
        <li><strong>JSON Writer</strong> - Creates/updates translation JSON files</li>
        <li><strong>Aggregator Generator</strong> - Creates the <code>messages.generated.ts</code> file</li>
        <li><strong>Key Generator</strong> - Deterministic key generation with AI fallback</li>
      </ul>

      <h3>3. Types (src/types/)</h3>
      <p>Shared TypeScript type definitions for consistency across the codebase.</p>

      <h2>How AST Parsing Works</h2>

      <p>
        i18nizer uses Abstract Syntax Tree (AST) parsing to understand and modify your code
        programmatically without breaking it.
      </p>

      <h3>The Process</h3>
      
      <div className="not-prose bg-gray-50 dark:bg-gray-800 rounded-lg p-6 my-6">
        <pre className="text-sm"><code>{`1. Source Code
   ↓
2. Tokenization (Lexer)
   ↓
3. AST Generation (Parser)
   ↓
4. AST Traversal (Visitor Pattern)
   ↓
5. String Extraction
   ↓
6. AST Modification
   ↓
7. Code Generation (Printer)`}</code></pre>
      </div>

      <h3>Example AST Transformation</h3>

      <p>When i18nizer encounters:</p>
      <pre><code className="language-tsx">{`<button>Click me</button>`}</code></pre>

      <p>The AST representation looks like:</p>
      <pre><code className="language-json">{`{
  "kind": "JsxElement",
  "openingElement": {
    "tagName": "button"
  },
  "children": [
    {
      "kind": "JsxText",
      "text": "Click me"
    }
  ]
}`}</code></pre>

      <p>i18nizer transforms it to:</p>
      <pre><code className="language-tsx">{`<button>{t("clickMe")}</button>`}</code></pre>

      <p>With the new AST structure:</p>
      <pre><code className="language-json">{`{
  "kind": "JsxElement",
  "openingElement": {
    "tagName": "button"
  },
  "children": [
    {
      "kind": "JsxExpression",
      "expression": {
        "kind": "CallExpression",
        "expression": { "name": "t" },
        "arguments": [
          { "kind": "StringLiteral", "text": "clickMe" }
        ]
      }
    }
  ]
}`}</code></pre>

      <h2>AI Provider Integration</h2>

      <h3>Translation Flow</h3>
      <div className="not-prose bg-gray-50 dark:bg-gray-800 rounded-lg p-6 my-6">
        <pre className="text-sm"><code>{`1. Extract strings from AST
   ↓
2. Check cache for existing translations
   ↓
3. For new strings:
   - Generate English key (AI or deterministic)
   - Request translations for all locales
   - Cache results
   ↓
4. Build JSON objects per locale
   ↓
5. Write to files`}</code></pre>
      </div>

      <h3>Key Generation Strategy</h3>
      
      <p>i18nizer uses a two-tier approach for generating translation keys:</p>

      <h4>1. AI-Powered (Primary)</h4>
      <p>When <code>useAiForKeys: true</code> (default):</p>
      <ul>
        <li>Sends source text to AI provider</li>
        <li>Requests an English camelCase key</li>
        <li>Caches the result with text hash</li>
        <li>Ensures keys are always English, regardless of source language</li>
      </ul>

      <h4>2. Deterministic Fallback</h4>
      <p>When AI is unavailable or <code>useAiForKeys: false</code>:</p>
      <ul>
        <li>Normalizes text (lowercase, remove punctuation)</li>
        <li>Converts to camelCase</li>
        <li>Truncates if too long</li>
        <li>Handles edge cases (numbers, symbols)</li>
      </ul>

      <h3>Prompt Engineering</h3>
      
      <p>i18nizer uses carefully crafted prompts to ensure quality translations:</p>

      <pre><code className="language-typescript">{`// Simplified example
const translationPrompt = \`
Translate the following text to \${targetLocale}.
Preserve any placeholders like {username} or {count}.
Return ONLY the translation, no explanations.

Source text: "\${sourceText}"
\``}</code></pre>

      <h2>Caching Strategy</h2>

      <p>
        i18nizer implements a sophisticated caching system to reduce API costs
        and ensure consistency.
      </p>

      <h3>Cache Structure</h3>
      <pre><code className="language-json">{`{
  "translations": {
    "hash-of-source-text": {
      "en": "Translation in English",
      "es": "Traducción en español",
      "fr": "Traduction en français"
    }
  },
  "keys": {
    "hash-of-source-text": "generatedKey"
  },
  "metadata": {
    "lastUpdated": "2024-01-14T12:00:00Z",
    "provider": "openai"
  }
}`}</code></pre>

      <h3>Cache Benefits</h3>
      <ul>
        <li><strong>Cost Reduction</strong> - Same string never translated twice</li>
        <li><strong>Consistency</strong> - Identical strings always get same translation</li>
        <li><strong>Speed</strong> - Instant lookup for cached entries</li>
        <li><strong>Offline Support</strong> - Work with cached translations without API</li>
      </ul>

      <h2>Framework Independence</h2>

      <p>
        i18nizer works without requiring a project-specific <code>tsconfig.json</code> by:
      </p>
      <ul>
        <li>Creating isolated TypeScript projects with ts-morph</li>
        <li>Using a minimal compiler configuration</li>
        <li>Not relying on type checking (only parsing and transformation)</li>
        <li>Operating on individual files independently</li>
      </ul>

      <h2>File Organization</h2>

      <h3>Project Structure</h3>
      <pre><code>{`i18nizer/
├── src/
│   ├── commands/           # CLI command implementations
│   ├── core/
│   │   ├── ast/           # AST parsing and transformation
│   │   ├── ai/            # AI provider integrations
│   │   └── i18n/          # JSON generation and management
│   ├── types/             # TypeScript type definitions
│   └── index.ts           # Main entry point
├── test/                  # Test files (mirrors src/)
├── bin/                   # Executable scripts
└── package.json`}</code></pre>

      <h2>Data Flow Diagram</h2>

      <div className="not-prose bg-gray-50 dark:bg-gray-800 rounded-lg p-6 my-6">
        <pre className="text-sm"><code>{`┌─────────────┐
│  User Input │
│ (CLI Args)  │
└──────┬──────┘
       │
       ↓
┌─────────────────┐
│ Command Handler │
└────────┬────────┘
         │
         ↓
┌──────────────────┐
│   AST Parser     │ ← File Content
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ String Extractor │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐      ┌──────────┐
│  Cache Lookup    │ ←──→ │  Cache   │
└────────┬─────────┘      └──────────┘
         │
         ↓
┌──────────────────┐      ┌──────────┐
│  AI Translation  │ ←──→ │ AI APIs  │
└────────┬─────────┘      └──────────┘
         │
         ↓
┌──────────────────┐
│  JSON Generator  │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│   AST Transform  │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  File Output     │
│  (JSON + TSX)    │
└──────────────────┘`}</code></pre>
      </div>

      <h2>Performance Considerations</h2>

      <ul>
        <li><strong>Parallel Processing</strong> - Multiple files can be processed concurrently</li>
        <li><strong>Lazy Loading</strong> - Only parse files when needed</li>
        <li><strong>Incremental Updates</strong> - Only translate new or changed strings</li>
        <li><strong>Smart Caching</strong> - Hash-based lookups for O(1) cache access</li>
      </ul>

      <h2>Error Handling</h2>

      <p>i18nizer implements robust error handling:</p>
      <ul>
        <li><strong>Parse Errors</strong> - Skip malformed files with warnings</li>
        <li><strong>API Failures</strong> - Retry with exponential backoff</li>
        <li><strong>File System Errors</strong> - Clear error messages with recovery suggestions</li>
        <li><strong>Validation</strong> - Validate configuration and inputs early</li>
      </ul>
    </div>
  )
}
