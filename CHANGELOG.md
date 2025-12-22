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
  