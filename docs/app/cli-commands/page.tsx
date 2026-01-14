import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CLI Commands',
  description: 'Complete reference for all i18nizer CLI commands, flags, and options',
}

export default function CLICommands() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <h1>CLI Commands</h1>
      
      <p>
        Complete reference for all i18nizer commands and their options.
      </p>

      <h2>i18nizer start</h2>
      <p>Initialize i18nizer in your project.</p>
      
      <h3>Usage</h3>
      <pre><code className="language-bash">i18nizer start [OPTIONS]</code></pre>

      <h3>Options</h3>
      <div className="not-prose">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Flag</th>
              <th className="px-4 py-2 text-left font-semibold">Description</th>
              <th className="px-4 py-2 text-left font-semibold">Values</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-4 py-2"><code>--framework</code></td>
              <td className="px-4 py-2">Specify the framework</td>
              <td className="px-4 py-2"><code>nextjs</code>, <code>react</code>, <code>custom</code></td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>--i18n</code></td>
              <td className="px-4 py-2">Specify the i18n library</td>
              <td className="px-4 py-2"><code>next-intl</code>, <code>react-i18next</code>, <code>i18next</code>, <code>custom</code></td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>--yes, -y</code></td>
              <td className="px-4 py-2">Skip interactive prompts</td>
              <td className="px-4 py-2">Boolean flag</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>--force, -f</code></td>
              <td className="px-4 py-2">Re-initialize existing project</td>
              <td className="px-4 py-2">Boolean flag</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Examples</h3>
      <pre><code className="language-bash">{`# Interactive mode
i18nizer start

# Auto-detect with defaults
i18nizer start --yes

# Next.js with next-intl
i18nizer start --framework nextjs --i18n next-intl

# React with react-i18next
i18nizer start --framework react --i18n react-i18next`}</code></pre>

      <h2>i18nizer translate</h2>
      <p>Extract and translate strings from components.</p>
      
      <h3>Usage</h3>
      <pre><code className="language-bash">i18nizer translate [FILE] [OPTIONS]</code></pre>

      <h3>Options</h3>
      <div className="not-prose">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Flag</th>
              <th className="px-4 py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-4 py-2"><code>--locales</code></td>
              <td className="px-4 py-2">Comma-separated list of locale codes (e.g., <code>en,es,fr</code>)</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>--all</code></td>
              <td className="px-4 py-2">Translate all components in the project</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>--dry-run</code></td>
              <td className="px-4 py-2">Preview changes without modifying files</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>--show-json</code></td>
              <td className="px-4 py-2">Display generated JSON output</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>--provider</code></td>
              <td className="px-4 py-2">Specify AI provider: <code>openai</code>, <code>gemini</code>, <code>huggingface</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Examples</h3>
      <pre><code className="language-bash">{`# Translate single file
i18nizer translate src/components/Login.tsx --locales en,es,fr

# Translate all files
i18nizer translate --all --locales en,es,fr,de

# Preview without changes
i18nizer translate src/components/Login.tsx --dry-run

# Show JSON output
i18nizer translate src/components/Login.tsx --show-json

# Use specific provider
i18nizer translate src/components/Login.tsx --provider gemini`}</code></pre>

      <h2>i18nizer extract (Legacy)</h2>
      <p>Legacy command for extracting strings. <code>translate</code> command is recommended instead.</p>
      
      <h3>Usage</h3>
      <pre><code className="language-bash">i18nizer extract FILE [OPTIONS]</code></pre>

      <h3>Options</h3>
      <div className="not-prose">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Flag</th>
              <th className="px-4 py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-4 py-2"><code>--locales</code></td>
              <td className="px-4 py-2">Languages to generate (default: <code>en,es</code>)</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>--provider</code></td>
              <td className="px-4 py-2">AI provider to use</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Example</h3>
      <pre><code className="language-bash">i18nizer extract src/components/Login.tsx --locales en,es,fr --provider openai</code></pre>

      <h2>i18nizer keys</h2>
      <p>Manage API keys for AI providers.</p>
      
      <h3>Usage</h3>
      <pre><code className="language-bash">i18nizer keys [OPTIONS]</code></pre>

      <h3>Options</h3>
      <div className="not-prose">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Flag</th>
              <th className="px-4 py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-4 py-2"><code>--setOpenAI KEY</code></td>
              <td className="px-4 py-2">Set OpenAI API key</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>--setGemini KEY</code></td>
              <td className="px-4 py-2">Set Google Gemini API key</td>
            </tr>
            <tr>
              <td className="px-4 py-2"><code>--setHF KEY</code></td>
              <td className="px-4 py-2">Set Hugging Face API key</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Examples</h3>
      <pre><code className="language-bash">{`# Set OpenAI key
i18nizer keys --setOpenAI sk-your-openai-key

# Set Gemini key
i18nizer keys --setGemini your-gemini-key

# Set Hugging Face key
i18nizer keys --setHF your-hf-key`}</code></pre>

      <h2>i18nizer regenerate</h2>
      <p>Rebuild the auto-generated aggregator file.</p>
      
      <h3>Usage</h3>
      <pre><code className="language-bash">i18nizer regenerate</code></pre>

      <p>
        This command regenerates the <code>i18n/messages.generated.ts</code> file by scanning all JSON files
        in your messages directory. Use this when:
      </p>
      <ul>
        <li>You manually add or remove translation JSON files</li>
        <li>You rename JSON files</li>
        <li>The aggregator becomes out of sync with your messages</li>
      </ul>

      <h3>Example</h3>
      <pre><code className="language-bash">i18nizer regenerate</code></pre>
    </div>
  )
}
