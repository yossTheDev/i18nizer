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

## ⚡ Usage

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

### Generated JSON (`.i18nizer/messages/en/Login.json`)

```json
{
  "Login": {
    "welcomeBack": "Welcome back",
    "pleaseSignInToContinue": "Please sign in to continue",
    "signIn": "Sign in"
  }
}
```

---

## 📂 Output Structure

```
.i18nizer/
├─ api-keys.json
├─ tsconfig.json
└─ messages/
   ├─ en/
   │  └─ Login.json
   ├─ es/
   │  └─ Login.json
   └─ fr/
      └─ Login.json
```

---

## ✨ Features

- Works with **JSX & TSX**
- Rewrites components automatically (`t("key")`)
- Always generates **English camelCase keys**
- Supports **any number of locales**
- Isolated TypeScript parsing (no project tsconfig required)
- Friendly logs and errors

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

- [ ] Cross-file string deduplication
- [ ] Key reuse mechanism
- [ ] Configurable output directory
- [ ] Framework support (Vue, Svelte)
- [ ] i18n library presets (`next-intl`, `react-i18next`)
- [ ] Watch mode
- [ ] Non-AI fallback mode

---

## ⚠️ Current Limitations

- Does not yet deduplicate identical strings across files
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
