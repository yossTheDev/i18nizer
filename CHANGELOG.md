# CHANGELOG

## 0.1.0

* Initial release
* Supported AI providers: OpenAI, Hugging Face, Gemini
* CLI works with JSX and TSX files
* Console logs show paths of saved locale files
* Ensures CLI works independently of user project tsconfig

## 0.1.1

* Added `.i18nizer` folder in project root for CLI data
  * `.i18nizer/tsconfig.json` for isolated TypeScript analysis
  * `.i18nizer/api-keys.json` for storing API keys locally per project
  * `.i18nizer/messages/` to store generated locale JSON files
* Automatically creates default `tsconfig.json` and `api-keys.json` if they do not exist
* Ensures CLI works independently of user project tsconfig
  
## 0.1.2

* Minor Fixes

## 0.1.3

* Fixed TSX/JSX parsing to work with any file path, avoiding Windows EPERM errors when scanning system folders.
* Updated parseFile to use a minimal in-memory ts-morph project, no tsconfig scanning required.
* Fixed extraction of translation keys: now correctly returns only the keys (e.g., hello, goodbye) instead of internal locale keys.
* Updated buildPrompt to:
* Always generate keys in English (camelCase).
* Support any number of locales dynamically.
* Ensure the AI outputs valid JSON only, with no explanations or markdown.

## 0.1.4

* Support for member function calls in text extraction and replacement (e.g., `toast.error`, `toast.success`, `toast.info`, `toast.warn`).
* `getFullCallName` helper added to properly handle member expressions when replacing or extracting text.
* Template literals inside allowed member functions are now correctly processed.
* JSX attributes, string literals, and template literals inside allowed calls now support placeholders in `t("key", { ... })`.
* Comments in replacement code updated to be fully in English for clarity.
