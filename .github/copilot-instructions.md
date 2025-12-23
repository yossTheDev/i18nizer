# Copilot Instructions for i18nizer

Welcome to the `i18nizer` codebase! This document provides essential guidelines for AI coding agents to be productive in this project. Please follow these instructions to ensure consistency and alignment with the project's architecture and conventions.

---

## 📂 Project Overview

`i18nizer` is a CLI tool designed to:

- Extract translatable strings from JSX/TSX files.
- Automatically generate i18n JSON files.
- Rewrite components to use `t()` for translations.

### Key Features:

- **AI Integration**: Supports OpenAI, Google Gemini, and Hugging Face for generating translations.
- **Output Structure**: Translations are stored in `.i18nizer/messages/<locale>/<Component>.json`.
- **Framework Independence**: Works without requiring a project-specific `tsconfig.json`.

---

## 🏗️ Architecture

### Core Components:

1. **Command Layer** (`src/commands/`):

   - Entry points for CLI commands like `extract` and `keys`.
   - Example: `src/commands/extract.ts` handles string extraction.

2. **Core Logic** (`src/core/`):

   - **AI Integration** (`src/core/ai/`): Handles communication with AI providers.
   - **AST Utilities** (`src/core/ast/`): Parses and modifies TypeScript/JSX files.
   - **i18n Utilities** (`src/core/i18n/`): Manages JSON file generation and updates.

3. **Types** (`src/types/`):

   - Shared TypeScript definitions.

4. **Tests** (`test/`):
   - Mirrors the `src/` structure for unit tests.

### Data Flow:

1. **Input**: User provides a file path and locales via CLI.
2. **Processing**:
   - AST parsing extracts strings.
   - AI generates translations.
   - Components are rewritten.
3. **Output**: JSON files and updated components.

---

## 🛠️ Developer Workflows

### Build & Run:

- **Install Dependencies**: `yarn install`
- **Run CLI Locally**: Use `bin/dev.cmd` or `bin/dev.js`.

### Testing:

- **Run Tests**: `yarn test`
- **Test Files**: Located in `test/` and mirror the `src/` structure.

### Debugging:

- Use `console.log` or a debugger in Node.js.
- Focus on `src/core/` for logic issues.

---

## 📏 Conventions

### Code Style:

- TypeScript is mandatory.
- Follow the ESLint rules defined in `eslint.config.mjs`.

### File Naming:

- Use camelCase for files.
- Tests should be named `<file>.test.ts`.

### Translation Keys:

- Always use camelCase for JSON keys.
- Keys are scoped to the component name.

---

## 🔗 Integration Points

### External Dependencies:

- **oclif**: CLI framework.
- **AI Providers**: OpenAI, Google Gemini, Hugging Face.

### Communication Patterns:

- **AI Requests**: Managed in `src/core/ai/client.ts`.
- **File Updates**: Handled in `src/core/i18n/write-files.ts`.

---

## 🚨 Notes for AI Agents

- **Do Not Commit API Keys**: Keys are stored locally in `[HOME]/.i18nizer/api-keys.json`.
- **Preserve Existing Translations**: Avoid overwriting JSON files unless explicitly required.
- **Follow the Roadmap**: Check the `README.md` for upcoming features and align contributions.

---

For questions or clarifications, refer to the `README.md` or consult the project owner.

Happy coding! 🚀
