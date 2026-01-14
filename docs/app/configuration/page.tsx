import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Configuration',
  description: 'Learn how to configure i18nizer for your project with i18nizer.config.yml',
}

export default function Configuration() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <h1>Configuration</h1>
      
      <p>
        i18nizer uses a <code>i18nizer.config.yml</code> file for project-level configuration.
        This file is created automatically when you run <code>i18nizer start</code>.
      </p>

      <h2>Configuration File Location</h2>
      <p>
        The configuration file should be located at the root of your project:
      </p>
      <pre><code>your-project/i18nizer.config.yml</code></pre>

      <h2>Configuration Schema</h2>
      <p>Here's a complete example configuration with all available options:</p>

      <pre><code className="language-yaml">{`framework: nextjs          # nextjs | react | custom
i18nLibrary: next-intl    # next-intl | react-i18next | i18next | custom
outputDir: messages       # Directory for translation files
cacheDir: .i18nizer       # Directory for caching

behavior:
  autoInjectT: false      # Auto-inject translation hooks
  useAiForKeys: true      # Use AI for English key generation
  
  allowedFunctions:       # Functions allowed in JSX
    - t
    - useTranslations
  
  allowedProps:           # Props to extract from
    - placeholder
    - title
    - alt
    - aria-label
    - label
  
  allowedMemberFunctions: # Member functions to extract
    - toString

ai:
  provider: openai        # openai | gemini | huggingface
  model: gpt-4           # AI model to use
  
paths:
  src: src               # Source directory
  i18n: i18n            # i18n output directory`}</code></pre>

      <h2>Framework Settings</h2>
      
      <h3>framework</h3>
      <p>Specifies your project's framework:</p>
      <ul>
        <li><code>nextjs</code> - Next.js projects</li>
        <li><code>react</code> - React projects (Create React App, Vite, etc.)</li>
        <li><code>custom</code> - Custom setup</li>
      </ul>

      <h3>i18nLibrary</h3>
      <p>Specifies your i18n library:</p>
      <ul>
        <li><code>next-intl</code> - For Next.js projects</li>
        <li><code>react-i18next</code> - For React projects</li>
        <li><code>i18next</code> - Vanilla i18next</li>
        <li><code>custom</code> - Custom setup</li>
      </ul>

      <h2>Behavior Settings</h2>

      <h3>autoInjectT</h3>
      <p>Controls whether i18nizer automatically injects translation hooks into components.</p>
      
      <pre><code className="language-yaml">{`behavior:
  autoInjectT: false  # Default for Next.js
  # autoInjectT: true  # Default for React`}</code></pre>

      <p><strong>Next.js Projects (default: false)</strong></p>
      <ul>
        <li>Disabled to avoid breaking Server Components</li>
        <li>Server Components cannot use hooks like <code>useTranslations</code></li>
        <li>i18nizer replaces strings with <code>t("key")</code> but won't inject the hook</li>
        <li>You manually add the translation hook where appropriate</li>
      </ul>

      <p><strong>React Projects (default: true)</strong></p>
      <ul>
        <li>Full automation: injects hooks and replaces strings</li>
        <li>Works seamlessly with Client Components</li>
      </ul>

      <h3>useAiForKeys</h3>
      <p>Uses AI to generate consistent English camelCase keys regardless of source language.</p>
      
      <pre><code className="language-yaml">{`behavior:
  useAiForKeys: true  # Default: enabled`}</code></pre>

      <p><strong>Benefits:</strong></p>
      <ul>
        <li>Keys are always in English, even if source text is in another language</li>
        <li>Readable keys: <code>welcomeBack</code> instead of <code>bienvenidoDeNuevo</code></li>
        <li>Keys are cached for deterministic behavior</li>
        <li>Minimal diffs across runs</li>
      </ul>

      <p><strong>Example:</strong></p>
      <pre><code className="language-tsx">{`// Source (Spanish):
<h1>Bienvenido de nuevo</h1>

// Generated key (English):
{
  "welcomeBack": "Bienvenido de nuevo"
}`}</code></pre>

      <h3>allowedFunctions</h3>
      <p>Functions that are allowed in JSX expressions. Helps avoid extracting function names as translatable strings.</p>
      
      <pre><code className="language-yaml">{`behavior:
  allowedFunctions:
    - t
    - useTranslations
    - console.log`}</code></pre>

      <h3>allowedProps</h3>
      <p>JSX props that should be extracted for translation.</p>
      
      <pre><code className="language-yaml">{`behavior:
  allowedProps:
    - placeholder
    - title
    - alt
    - aria-label
    - aria-placeholder
    - label
    - text
    - tooltip
    - helperText`}</code></pre>

      <h3>allowedMemberFunctions</h3>
      <p>Member functions allowed in expressions.</p>
      
      <pre><code className="language-yaml">{`behavior:
  allowedMemberFunctions:
    - toString
    - valueOf`}</code></pre>

      <h2>AI Provider Settings</h2>

      <h3>provider</h3>
      <p>Select which AI provider to use:</p>
      <ul>
        <li><code>openai</code> - OpenAI GPT models</li>
        <li><code>gemini</code> - Google Gemini</li>
        <li><code>huggingface</code> - Hugging Face models (e.g., DeepSeek)</li>
      </ul>

      <pre><code className="language-yaml">{`ai:
  provider: openai
  model: gpt-4`}</code></pre>

      <h3>Configuring API Keys</h3>
      <p>
        API keys are stored separately in <code>[HOME]/.i18nizer/api-keys.json</code> and are never
        committed to your repository.
      </p>
      
      <pre><code className="language-bash">{`# Set API keys
i18nizer keys --setOpenAI your-key
i18nizer keys --setGemini your-key
i18nizer keys --setHF your-key`}</code></pre>

      <h2>Path Settings</h2>

      <h3>outputDir</h3>
      <p>Directory where translation JSON files are stored.</p>
      <pre><code className="language-yaml">outputDir: messages</code></pre>

      <h3>cacheDir</h3>
      <p>Directory for caching translations and keys.</p>
      <pre><code className="language-yaml">cacheDir: .i18nizer</code></pre>

      <h3>paths.src</h3>
      <p>Source directory containing your components.</p>
      <pre><code className="language-yaml">{`paths:
  src: src`}</code></pre>

      <h3>paths.i18n</h3>
      <p>Directory for the auto-generated aggregator file.</p>
      <pre><code className="language-yaml">{`paths:
  i18n: i18n`}</code></pre>

      <h2>Caching Strategy</h2>
      
      <p>i18nizer implements intelligent caching to:</p>
      <ul>
        <li><strong>Reduce AI costs</strong> - Avoid repeated translation requests</li>
        <li><strong>Ensure consistency</strong> - Same input always produces same output</li>
        <li><strong>Speed up processing</strong> - Cached lookups are instant</li>
      </ul>

      <p>The cache is stored in <code>.i18nizer/cache/translations.json</code> and includes:</p>
      <ul>
        <li>Translation results (text → translations)</li>
        <li>Generated keys (text → key)</li>
        <li>Metadata (timestamps, providers used)</li>
      </ul>

      <h2>Example Configurations</h2>

      <h3>Next.js with next-intl</h3>
      <pre><code className="language-yaml">{`framework: nextjs
i18nLibrary: next-intl
outputDir: messages
cacheDir: .i18nizer

behavior:
  autoInjectT: false      # Manual for Server Components
  useAiForKeys: true
  allowedProps:
    - placeholder
    - title
    - alt
    - aria-label

ai:
  provider: openai
  model: gpt-4`}</code></pre>

      <h3>React with react-i18next</h3>
      <pre><code className="language-yaml">{`framework: react
i18nLibrary: react-i18next
outputDir: public/locales
cacheDir: .i18nizer

behavior:
  autoInjectT: true       # Auto-inject for React
  useAiForKeys: true
  allowedProps:
    - placeholder
    - title
    - alt

ai:
  provider: gemini
  model: gemini-pro`}</code></pre>
    </div>
  )
}
