# i18nizer 🌍

![banner](./imgs/banner.png)

<div align="center">
<img src="https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=fff&style=for-the-badge" alt="Node.js Badge">
<img src="https://img.shields.io/badge/oclif-000?logo=oclif&logoColor=fff&style=for-the-badge" alt="oclif Badge">
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge" alt="TypeScript Badge">
<img src="https://img.shields.io/npm/dw/i18nizer.svg?style=for-the-badge" alt="npm downloads">
<img src="https://img.shields.io/github/license/yossTheDev/i18nizer?style=for-the-badge" alt="license">
<img src="https://img.shields.io/github/actions/workflow/status/yossTheDev/i18nizer/test.yml?style=for-the-badge&label=tests" alt="test status">
</div>

---

**i18nizer** is a developer-first CLI that **extracts translatable strings from JSX/TSX files**, automatically generates **i18n JSON files**, and **rewrites your components to use `t()`**.

It is designed to be fast, scriptable, CI-friendly, and completely **independent from your project configuration**.

### Supported AI Providers

- **OpenAI**
- **Google Gemini**
- **Hugging Face (DeepSeek)**

---

## 🚀 Installation

```bash
npm install -g i18nizer
```

> Requires Node.js 18+

---

## 🔑 API Keys Configuration

```bash
i18nizer keys --setOpenAI <YOUR_OPENAI_API_KEY>
i18nizer keys --setGemini <YOUR_GEMINI_API_KEY>
i18nizer keys --setHF <YOUR_HUGGING_FACE_API_KEY>
```

Keys are stored inside:

```
[HOME]/.i18nizer/api-keys.json
```

---

## ⚡ Quick Start

### Initialize Your Project

#### Interactive Mode (Recommended)

```bash
i18nizer start
```

This launches an **interactive setup** that will:
- 🔍 Auto-detect your framework (Next.js or React)
- 🔍 Auto-detect your i18n library (next-intl, react-i18next, i18next)
- ❓ Ask you to confirm or change the detected settings
- ✅ Create `i18nizer.config.yml` with optimal defaults
- 📁 Set up `.i18nizer/` directory for caching and project data
- 📂 Create `messages/` directory for translation files

#### Non-Interactive Mode (CI/Automation)

```bash
i18nizer start --yes
```

Auto-detects and uses default values without prompts.

#### Manual Configuration

Specify framework and i18n library explicitly:

```bash
# Next.js with next-intl
i18nizer start --framework nextjs --i18n next-intl

# React with react-i18next
i18nizer start --framework react --i18n react-i18next

# Custom setup
i18nizer start --framework custom --i18n custom
```

**Available options:**
- `--framework`: `nextjs`, `react`, `custom`
- `--i18n`: `next-intl`, `react-i18next`, `i18next`, `custom`
- `--yes`, `-y`: Skip interactive prompts
- `--force`, `-f`: Re-initialize existing project

### Translate Your Components

**Translate a single file:**

```bash
i18nizer translate src/components/Login.tsx --locales en,es,fr
```

**Translate all components in your project:**

```bash
i18nizer translate --all --locales en,es,fr
```

**Preview changes without modifying files:**

```bash
i18nizer translate <file> --dry-run
```

**Show generated JSON output:**

```bash
i18nizer translate <file> --show-json
```

### Regenerate Aggregator

**Rebuild the auto-generated aggregator file:**

```bash
i18nizer regenerate
```

This command regenerates the `i18n/messages.generated.ts` file by scanning all JSON files in your messages directory. Use this when:
- You manually add or remove translation JSON files
- You rename JSON files
- The aggregator becomes out of sync with your messages

The aggregator automatically uses valid TypeScript identifiers for imports, converting hyphenated filenames (e.g., `notification-item.json`) to PascalCase identifiers (e.g., `NotificationItem_en`).

### Legacy Command (Still Supported)

```bash
i18nizer extract <file-path> --locales en,es,fr --provider openai
```

Flags:

- `--locales` → Languages to generate (default: `en,es`)
- `--provider` → `openai | gemini | huggingface` (optional)

---

## 🧩 Example

### Input Component

```tsx
export function Login() {
  return (
    <div>
      <h1>Welcome back</h1>
      <p>Please sign in to continue</p>
      <button>Sign in</button>
    </div>
  );
}
```

---

### Output Component (Automatically Rewritten)

```tsx
import { useTranslations } from "next-intl";

export function Login() {
  const t = useTranslations("Login");

  return (
    <div>
      <h1>{t("welcomeBack")}</h1>
      <p>{t("pleaseSignInToContinue")}</p>
      <button>{t("signIn")}</button>
    </div>
  );
}
```

---

### Generated JSON (`messages/en/login.json`)

```json
{
  "Login": {
    "welcomeBack": "Welcome back",
    "pleaseSignInToContinue": "Please sign in to continue",
    "signIn": "Sign in"
  }
}
```

**Note:** The filename uses lowercase-hyphen format (`login.json`), while the namespace inside uses PascalCase (`Login`).

---

## 📂 Project Structure

When initialized with `i18nizer start`:

```
your-project/
├─ i18nizer.config.yml       # Configuration file
├─ .i18nizer/
│  ├─ cache/
│  │  └─ translations.json   # Translation cache
│  └─ ...
├─ i18n/
│  └─ messages.generated.ts  # Auto-generated aggregator (imports all JSON files)
└─ messages/                 # Translation files (configurable path)
   ├─ en/
   │  └─ login.json          # Lowercase-hyphen format for filenames
   ├─ es/
   │  └─ login.json
   └─ fr/
      └─ login.json
```

**Note:** JSON filenames use lowercase-hyphen format (e.g., `notification-item.json`, `user-profile.json`), while the namespace inside the JSON file uses PascalCase (e.g., `NotificationItem`, `UserProfile`). The auto-generated aggregator converts filenames to valid TypeScript identifiers.

Legacy standalone mode (without `i18nizer start`):

```
[HOME]/.i18nizer/
├─ api-keys.json
├─ tsconfig.json
├─ i18n/
│  └─ messages.generated.ts  # Auto-generated aggregator
└─ messages/
   ├─ en/
   │  └─ login.json
   ├─ es/
   │  └─ login.json
   └─ fr/
      └─ login.json
```

---

## ⚙️ Configuration

### Translation Function Injection (`autoInjectT`)

i18nizer can automatically inject translation hooks into your components:

```ts
const t = useTranslations("ComponentName");
```

This behavior is controlled by `behavior.autoInjectT` in `i18nizer.config.yml`:

**Next.js Projects** (disabled by default):
```yaml
behavior:
  autoInjectT: false  # Disabled to avoid breaking Server Components
```

- Server Components cannot use hooks like `useTranslations`
- i18nizer will replace strings with `t("key")` but won't inject the hook
- You manually add the translation hook where appropriate

**React Projects** (enabled by default):
```yaml
behavior:
  autoInjectT: true  # Safe for Client Components
```

- Full automation: injects hooks and replaces strings
- Works seamlessly with React components

**Why disabled for Next.js?**
- Automatically detecting Server vs Client Components is ambiguous
- Injecting hooks in Server Components causes runtime errors
- User has full control over translation function placement

You can override this setting in your `i18nizer.config.yml` if you know your setup.

### AI-Powered English Key Generation (`useAiForKeys`)

i18nizer uses AI to generate **English camelCase keys** regardless of your source language:

```yaml
behavior:
  useAiForKeys: true  # Default: enabled
```

**Benefits:**
- **Consistent keys**: Keys are always in English, even if your source text is in Spanish, French, German, etc.
- **Readable**: `welcomeBack` instead of `bienvenidoDeNuevo`
- **Stable**: Keys are cached per source text for deterministic behavior across runs
- **Minimal diffs**: Same source text always produces the same key

**How it works:**
1. First run: AI generates an English key for each source text
2. Key is cached with the source text hash
3. Subsequent runs: Cached key is reused (no AI call needed)
4. Fallback: If AI is unavailable, uses deterministic camelCase generation

**Example:**

Source text (Spanish):
```tsx
<h1>Bienvenido de nuevo</h1>
<button>Iniciar sesión</button>
```

Generated keys (English):
```json
{
  "welcomeBack": "Bienvenido de nuevo",
  "signIn": "Iniciar sesión"
}
```

**Disabling AI key generation:**

If you prefer deterministic key generation based on source text:

```yaml
behavior:
  useAiForKeys: false
```

Note: Keys will be in the source language (e.g., `bienvenidoDeNuevo` for Spanish text).

---

## ✨ Features

### Phase 1 (Current)

- **Project-level integration** with `i18nizer start` and `i18nizer translate`
- **Configuration system** with `i18nizer.config.yml`
- **Framework presets** (Next.js + next-intl, React + react-i18next)
- **Intelligent caching** to avoid redundant AI translation requests
- **String deduplication** with deterministic key reuse
- **AI-powered English key generation** for consistent, readable keys regardless of source language
- **Configurable behavior** (allowed functions, props, member functions)
- **Dry-run mode** to preview changes
- **JSON output preview** with `--show-json`
- Project-wide or single-file translation
- Works with **JSX & TSX**
- Rewrites components automatically (`t("key")`)
- Generates **English camelCase keys** (AI-assisted with deterministic fallback)
- Supports **any number of locales**
- Isolated TypeScript parsing (no project tsconfig required)
- Friendly logs with colors and spinners

### Supported Extraction Cases

- **JSX text children**: `<div>Hello</div>`
- **JSX attributes**: `placeholder`, `title`, `alt`, `aria-label`, `aria-placeholder`, `label`, `text`, `tooltip`, `helperText`
- **String literals**: `placeholder="Enter name"`
- **Curly-braced strings**: `placeholder={"Enter name"}`
- **Template literals**: `` placeholder={`Enter name`} ``
- **Template literals with placeholders**: `` <p>{`Hello ${name}`}</p> ``
- **Ternary operators**: `placeholder={condition ? "Text A" : "Text B"}`
- **Logical AND**: `{condition && "Visible text"}`
- **Logical OR**: `{condition || "Fallback text"}`
- **Nested expressions**: Complex combinations of the above

### Filtering & Quality

- **Skips non-translatable content**: Single symbols (`*`, `|`), punctuation-only strings (`...`), whitespace
- **Deterministic key generation**: Same input always produces the same key
- **Stable JSON output**: Alphabetically sorted keys, consistent formatting
- **2-space indentation**: Clean and diff-friendly JSON files

---

## 🔮 Roadmap

### ✅ Phase 0: Foundation & Reliability (Complete)
- Stable extraction and replacement
- Deterministic key generation
- Comprehensive test coverage
- JSON output quality

### ✅ Phase 1: Project Integration (Complete)
- `i18nizer start` command for project initialization
- `i18nizer translate` command with `--all` flag
- Configuration system with YAML
- Framework detection and presets
- Intelligent caching system
- Cross-file string deduplication
- Configurable behavior (allowed props, functions, etc.)
- Dry-run and JSON preview modes

### 🚧 Phase 2: Advanced Features (Planned)
- [ ] Watch mode for continuous translation
- [ ] Non-AI fallback mode
- [ ] Framework support (Vue, Svelte)
- [ ] Additional i18n library presets
- [ ] Pluralization support
- [ ] Context-aware translations
- [ ] Translation memory and glossary

---

## ⚠️ Current Limitations

- AI-generated keys may vary between runs (deterministic fallback available)
- Only supports React JSX/TSX (no Vue, Svelte yet)
- Does not handle runtime-only string generation

---

## ⚠️ Notes

- API keys are **never committed**
- JSON files are stored in `/{HOME}/.i18nizer/`
- Designed for incremental adoption

---

Made with ❤️ by **Yoannis Sánchez Soto**
