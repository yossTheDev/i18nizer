import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Getting Started',
  description: 'Get started with i18nizer - installation, setup, and your first translation',
}

export default function GettingStarted() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <h1>Getting Started</h1>
      
      <p>
        This guide will walk you through installing i18nizer, setting up your project,
        and running your first translation.
      </p>

      <h2>Requirements</h2>
      <ul>
        <li><strong>Node.js 18+</strong> - i18nizer requires Node.js version 18 or higher</li>
        <li><strong>Existing i18n setup</strong> - Currently works with i18next, next-intl, or react-i18next</li>
        <li><strong>AI API key</strong> - Optional but recommended for automatic translations (OpenAI, Google Gemini, or Hugging Face)</li>
      </ul>

      <h2>Installation</h2>
      <p>Install i18nizer globally using npm:</p>
      <pre><code className="language-bash">npm install -g i18nizer</code></pre>

      <p>Or using yarn:</p>
      <pre><code className="language-bash">yarn global add i18nizer</code></pre>

      <p>Verify the installation:</p>
      <pre><code className="language-bash">i18nizer --version</code></pre>

      <h2>API Key Configuration</h2>
      <p>
        To enable AI-powered translations, configure at least one AI provider.
        API keys are stored locally in <code>[HOME]/.i18nizer/api-keys.json</code> and are never committed to your repository.
      </p>

      <h3>OpenAI</h3>
      <pre><code className="language-bash">i18nizer keys --setOpenAI YOUR_OPENAI_API_KEY</code></pre>

      <h3>Google Gemini</h3>
      <pre><code className="language-bash">i18nizer keys --setGemini YOUR_GEMINI_API_KEY</code></pre>

      <h3>Hugging Face</h3>
      <pre><code className="language-bash">i18nizer keys --setHF YOUR_HUGGING_FACE_API_KEY</code></pre>

      <h2>Initialize Your Project</h2>
      
      <h3>Interactive Mode (Recommended)</h3>
      <p>Run the interactive setup which will auto-detect your framework and i18n library:</p>
      <pre><code className="language-bash">i18nizer start</code></pre>

      <p>This command will:</p>
      <ul>
        <li>🔍 Auto-detect your framework (Next.js or React)</li>
        <li>🔍 Auto-detect your i18n library (next-intl, react-i18next, i18next)</li>
        <li>❓ Ask you to confirm or change the detected settings</li>
        <li>✅ Create <code>i18nizer.config.yml</code> with optimal defaults</li>
        <li>📁 Set up <code>.i18nizer/</code> directory for caching</li>
        <li>📂 Create <code>messages/</code> directory for translation files</li>
      </ul>

      <h3>Non-Interactive Mode</h3>
      <p>For CI/CD pipelines or automated setups:</p>
      <pre><code className="language-bash">i18nizer start --yes</code></pre>

      <h3>Manual Configuration</h3>
      <p>Specify framework and i18n library explicitly:</p>
      <pre><code className="language-bash">{`# Next.js with next-intl
i18nizer start --framework nextjs --i18n next-intl

# React with react-i18next
i18nizer start --framework react --i18n react-i18next`}</code></pre>

      <h2>Your First Translation</h2>
      
      <h3>Translate a Single File</h3>
      <p>Let's translate a simple React component:</p>
      <pre><code className="language-bash">i18nizer translate src/components/Login.tsx --locales en,es,fr</code></pre>

      <p>This will:</p>
      <ol>
        <li>Extract all translatable strings from the component</li>
        <li>Generate translation keys using AI</li>
        <li>Create translation JSON files for English, Spanish, and French</li>
        <li>Rewrite the component to use <code>t()</code> function</li>
      </ol>

      <h3>Preview Changes First</h3>
      <p>Use dry-run mode to see what would change without modifying files:</p>
      <pre><code className="language-bash">i18nizer translate src/components/Login.tsx --dry-run</code></pre>

      <h3>Translate Multiple Files</h3>
      <p>Translate all components in your project at once:</p>
      <pre><code className="language-bash">i18nizer translate --all --locales en,es,fr,de</code></pre>

      <h2>Understanding the Output</h2>
      
      <p>After running i18nizer, your project structure will look like this:</p>
      <pre><code>{`your-project/
├── i18nizer.config.yml       # Configuration
├── .i18nizer/
│   ├── cache/
│   │   └── translations.json # Translation cache
│   └── ...
├── i18n/
│   └── messages.generated.ts # Auto-generated aggregator
└── messages/                 # Translation files
    ├── en/
    │   └── login.json
    ├── es/
    │   └── login.json
    └── fr/
        └── login.json`}</code></pre>

      <h2>Next Steps</h2>
      <ul>
        <li>Learn about <a href="/cli-commands">CLI commands and options</a></li>
        <li>Configure <a href="/configuration">project settings</a></li>
        <li>Explore <a href="/examples">real-world examples</a></li>
      </ul>
    </div>
  )
}
