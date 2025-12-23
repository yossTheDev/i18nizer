# i18nizer 🌍

![banner](./imgs/banner.png)

<div align="center">
<img src="https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=fff&style=for-the-badge" alt="Node.js Badge">
<img src="https://img.shields.io/badge/oclif-000?logo=oclif&logoColor=fff&style=for-the-badge" alt="oclif Badge">
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge" alt="TypeScript Badge">
<img src="https://img.shields.io/npm/dw/i18nizer.svg?style=for-the-badge" alt="npm downloads">
<img src="https://img.shields.io/github/license/yossTheDev/i18nizer?style=for-the-badge" alt="license">
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
- Friendly logs, and errors

---

## 🔮 Roadmap

- Configurable output directory
- Framework support (Vue, Svelte)
- i18n library presets (`next-intl`, `react-i18next`)
- Watch mode
- Non-AI fallback mode

---

## ⚠️ Notes

- API keys are **never committed**
- JSON files are stored per project in `.i18nizer/`
- Designed for incremental adoption

---

Made with ❤️ by **Yoannis Sánchez Soto**
