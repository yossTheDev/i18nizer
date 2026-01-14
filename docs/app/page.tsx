import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
          i18nizer 🌍
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Automate the boring parts of internationalization for React and Next.js projects
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/getting-started"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/yossTheDev/i18nizer"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-600 dark:hover:border-primary-600 transition-colors font-medium"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* What's New in v0.7.0 */}
      <section className="bg-gradient-to-r from-primary-50 to-green-50 dark:from-gray-800 dark:to-gray-800 rounded-lg p-8 border border-primary-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🎉</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">What's New in v0.7.0</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Configure your AI provider and project paths, plus <strong>automatic pluralization and rich text detection</strong> with zero configuration required
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold mb-1">AI Provider Configuration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose between OpenAI, Gemini, or Hugging Face with custom models
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Paths Configuration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Define your source and i18n output directories once
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Automatic Pluralization</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Detects and converts plural patterns to ICU message format automatically
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Automatic Rich Text</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Handles JSX elements within text with automatic t.rich() generation
                </p>
              </div>
            </div>
            <Link
              href="/changelog"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
            >
              View full changelog →
            </Link>
          </div>
        </div>
      </section>

      {/* What is i18nizer */}
      <section>
        <h2 className="text-3xl font-bold mb-4">What is i18nizer?</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          i18nizer is a CLI tool that automates the tedious process of internationalization in React and Next.js projects.
          It extracts hardcoded strings from your JSX/TSX files, generates AI-powered translations, and rewrites your components
          to use translation functions.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          No runtime dependencies, no SaaS, no lock-in. Just a CLI that fits into your existing development workflow.
        </p>
      </section>

      {/* Key Features */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon="🤖"
            title="AI-Powered Translations"
            description="Generate translations using OpenAI, Google Gemini, or Hugging Face at development time"
          />
          <FeatureCard
            icon="⚡"
            title="Automatic Extraction"
            description="Extract translatable strings from JSX/TSX files with intelligent filtering"
          />
          <FeatureCard
            icon="🔄"
            title="Component Rewriting"
            description="Automatically rewrite components to use t() translation functions"
          />
          <FeatureCard
            icon="🎯"
            title="Smart Key Generation"
            description="AI-powered English camelCase keys for consistent, readable translation keys"
          />
          <FeatureCard
            icon="💾"
            title="Intelligent Caching"
            description="Cache translations and keys to avoid redundant AI requests and ensure consistency"
          />
          <FeatureCard
            icon="🔧"
            title="Framework Integration"
            description="Built-in support for i18next, next-intl, and react-i18next"
          />
        </div>
      </section>

      {/* Why i18nizer Exists */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Why i18nizer?</h2>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Internationalization is essential but tedious. The manual process involves:
          </p>
          <ul>
            <li>Finding and extracting every hardcoded string</li>
            <li>Creating translation keys that are consistent and readable</li>
            <li>Manually translating content to multiple languages</li>
            <li>Rewriting components to use translation functions</li>
            <li>Maintaining JSON files across locales</li>
          </ul>
          <p>
            i18nizer automates all of this, letting you focus on building features instead of managing i18n boilerplate.
            It works with your existing i18n setup—no runtime changes, no vendor lock-in.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Quick Start</h2>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Install i18nizer</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
              <code>npm install -g i18nizer</code>
            </pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Initialize your project</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
              <code>i18nizer start</code>
            </pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Translate your components</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
              <code>i18nizer translate src/components/Login.tsx --locales en,es,fr</code>
            </pre>
          </div>
        </div>
        <div className="mt-6">
          <Link
            href="/getting-started"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Read the full guide →
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-primary-600 dark:hover:border-primary-600 transition-colors">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}
