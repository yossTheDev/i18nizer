# i18nizer 🌍

![banner](./imgs/banner.png)

<div align="center">
<img src="https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=fff&style=for-the-badge" alt="Node.js Badge">
<img src="https://img.shields.io/badge/oclif-000?logo=oclif&logoColor=fff&style=for-the-badge" alt="oclif Badge">
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge" alt="TypeScript Badge">
<img alt="Licence" src="https://img.shields.io/npm/dw/i18nizer.svg?style=for-the-badge">
<img alt="Licence" src="https://img.shields.io/github/license/yossTheDev/i18nizer?style=for-the-badge">
</div>

i18nizer is a practical CLI to **extract translatable texts from your TSX/JSX components** and automatically generate i18n JSON files.
It works with **Gemini** and **Hugging Face (DeepSeek)** AI providers to generate translations and prepares your components to use `t()` easily.

---

## 🚀 Installation

You can install the CLI globally using **npm**:

```bash
npm install -g i18nizer
```

> Requires Node.js 18+ and internet access to call the translation APIs.

---

## 🛠️ API Keys Configuration

Before generating translations, you need to set up your API keys:

```bash
i18nizer keys --setGemini <YOUR_GEMINI_API_KEY>
i18nizer keys --setHF <YOUR_HUGGING_FACE_API_KEY>
```

* Keys are stored securely in your **global user folder** (`~/.mycli/api-keys.json` on Linux/Mac or `C:\Users\<User>\.mycli\api-keys.json` on Windows).
* To see which keys are set (partially masked):

```bash
i18nizer keys --show
```

---

## ⚡ Main Commands

### 1. Extract and Generate Translations

```bash
i18nizer extract <file-path>
```

**Available flags:**

* `-l, --locales` → List of locales to generate (default: `en,es`)
* `-p, --provider` → AI provider to generate translations (optional, default: `huggingface`). Options: `gemini`, `huggingface`

**Example:**

```bash
i18nizer extract src/components/Button.tsx --locales en,es,fr --provider gemini
```

**What this command does:**

* Extracts all translatable texts from your JSX/TSX file.
* Generates translations using the selected AI provider.
* Automatically inserts `t()` calls in the component.
* Saves JSON files in `messages/<locale>/<component>.json`.
* Logs the paths of generated files.

---

### 2. Manage API Keys

```bash
i18nizer keys
```

**Available flags:**

* `--setGemini` → Set your Gemini key
* `--setHF` → Set your Hugging Face key
* `--show` → Show stored keys (masked)

---

## 💡 Current Features

* Compatible with **JSX and TSX**
* Works with AI providers: **Gemini**, **Hugging Face (DeepSeek)**
* Automatically inserts `t()` calls in components
* Generates JSON files for each locale
* Spinner and colored logs with emojis for better UX

---

## 🔮 Future Ideas

* Configurable **output directory** for JSON files
* Support for other frameworks and file types (Vue, Svelte, etc.)
* Better integration with `next-intl` or `react-i18next`
* Keychain / Credential Manager support for storing API keys securely
* Multi-project support and locale presets

---

## 📂 Output Structure

```
messages/
├─ en/
│  └─ Button.json
├─ es/
│  └─ Button.json
└─ fr/
   └─ Button.json
```

Each JSON contains a namespace with AI-generated keys:

```json
{
  "button": {
    "submitText": "Submit",
    "cancelText": "Cancel"
  }
}
```

---

## ⚠️ Notes

* For the first version, JSON files are saved **inside the project** under `messages/<locale>/`.
* Make sure **not to commit your API keys** to the repository.
* The CLI is designed to be simple and functional, ideal for starting automatic i18n in React projects.

---

> Made with ❤️ by Yoannis Sánchez Soto
