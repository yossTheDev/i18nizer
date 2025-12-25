# CHANGELOG

## 0.4.0 - Phase 1: Project Integration (Unreleased)

**This release completes Phase 1 - project-level integration with configuration, caching, and intelligent string management.**

### ✨ New Features

* **`i18nizer start` command**: Initialize i18nizer in your project
  * **Interactive mode**: Prompts for framework and i18n library selection (like `yarn create vite`)
  * **Automatic framework detection** (Next.js, React)
  * **Automatic i18n library detection** (next-intl, react-i18next, i18next)
  * **Manual configuration** with `--framework` and `--i18n` flags
  * **Non-interactive mode** with `--yes` flag for CI/automation
  * Framework presets with optimal defaults
  * Generates `i18nizer.config.yml` configuration file with detected i18n library
  * Creates `.i18nizer/` directory for caching and project data
  * Sets up configurable `messages/` directory

* **`i18nizer translate` command**: Enhanced translation workflow
  * Project-level mode with `--all` flag to translate all components
  * Single-file mode for targeted translation
  * `--dry-run` flag to preview changes without modifying files
  * `--show-json` flag to display generated translation output
  * Integrated with project configuration system
  * Supports both initialized projects and standalone mode

* **Configuration system**:
  * YAML-based configuration (`i18nizer.config.yml`)
  * Framework presets (Next.js, React, Custom)
  * I18n library-specific configurations (next-intl, react-i18next, i18next)
  * Combined presets (e.g., Next.js + next-intl, React + react-i18next)
  * **`autoInjectT` option**: Control automatic translation function injection
    * Disabled by default for Next.js (avoids breaking Server Components)
    * Enabled by default for React (safe for Client Components)
    * User can override in config file
  * Configurable i18n function and import source
  * Customizable messages directory and default locale
  * Configurable behavior (deduplication, allowed props/functions)

* **Intelligent caching**:
  * Translation cache in `.i18nizer/cache/`
  * Avoids redundant AI translation requests
  * String-to-key mapping for fast lookups
  * Persistent across multiple runs

* **String deduplication**:
  * Detects duplicate strings across components
  * Reuses deterministic keys for identical strings
  * Reduces translation costs and ensures consistency

* **Configurable extraction**:
  * Allowed JSX props can be customized via config
  * Allowed functions can be customized via config
  * Allowed member functions can be customized via config
  * All behavior configurable with sensible defaults

* **Enhanced CLI feedback**:
  * Colored output with chalk
  * Progress spinners with ora
  * Interactive prompts with inquirer
  * Detailed summary statistics
  * Clear error messages and guidance

### 🏗️ Architecture

* New modular structure:
  * `src/core/config/` - Configuration management
  * `src/core/cache/` - Translation caching
  * `src/core/deduplication/` - String deduplication logic
  * `src/core/scanner/` - File discovery and scanning
  * `src/types/config.ts` - Configuration types and presets

### 🔧 Internal Improvements

* Separated extraction and replacement logic
* Made extraction options configurable
* Added project detection utilities
* Improved file scanning with directory exclusions
* Better organization of core modules

### 📚 Documentation

* Updated README with Phase 1 features
* Added quick start guide
* Documented all new commands and flags
* Updated roadmap to reflect completion
* Added project structure documentation

---

## 0.3.0 - Phase 0: Foundation & Reliability (Unreleased)

**This release completes Phase 0 - stabilizing the core extraction, replacement, and reliability features.**

### ✨ New Features

* **Expanded prop support**: Added support for `aria-placeholder`, `label`, `text`, `tooltip`, and `helperText` attributes
* **Deterministic key generation**: Implemented fallback key generation algorithm that produces stable, human-readable camelCase keys
* **Improved JSON output quality**:
  * Keys are now alphabetically sorted for stable, predictable output
  * Consistent 2-space indentation for clean, diff-friendly JSON
  * Trailing newlines added to all JSON files
* **Enhanced non-translatable filtering**: Better detection of symbols, punctuation-only strings, and meaningless tokens

### 🧪 Testing

* Expanded test suite from 26 to 60+ tests
* Added comprehensive tests for:
  * All new supported props
  * Non-translatable content filtering edge cases
  * Deterministic key generation
  * JSON output quality and stability
* All tests passing on Node 18, 20, and latest

### 📚 Documentation

* Updated README with:
  * Complete list of supported extraction cases
  * Filtering and quality features
  * Current limitations
* Updated roadmap to reflect Phase 0 completion

### 🔧 Internal Improvements

* Improved code organization and maintainability
* Better test coverage for core functionality
* More predictable and stable output

---

## 0.2.0

* **Enhanced text extraction for complex JSX expressions**:
  * Added support for extracting strings from ternary operators in JSX attributes and children (`condition ? "text1" : "text2"`)
  * Added support for logical AND (`&&`) and OR (`||`) operators
  * Added support for curly-braced string literals in JSX attributes (`placeholder={"text"}`)
  * Improved filtering to skip non-translatable content (punctuation-only strings, single symbols like `*`, whitespace)
* **Improved test coverage**:
  * Added comprehensive test suite for all extraction edge cases
  * Tests verify ternary operators, logical operators, nested expressions, and filtering logic
* **CI/CD improvements**:
  * Added test status badge to README
  * Test workflow runs automatically on every push

## 0.1.5

* Minor Fixes
  
## 0.1.4

* Support for member function calls in text extraction and replacement (e.g., `toast.error`, `toast.success`, `toast.info`, `toast.warn`).
* `getFullCallName` helper added to properly handle member expressions when replacing or extracting text.
* Template literals inside allowed member functions are now correctly processed.
* JSX attributes, string literals, and template literals inside allowed calls now support placeholders in `t("key", { ... })`.
* Comments in replacement code updated to be fully in English for clarity.

## 0.1.3

* Fixed TSX/JSX parsing to work with any file path, avoiding Windows EPERM errors when scanning system folders.
* Updated parseFile to use a minimal in-memory ts-morph project, no tsconfig scanning required.
* Fixed extraction of translation keys: now correctly returns only the keys (e.g., hello, goodbye) instead of internal locale keys.
* Updated buildPrompt to:
* Always generate keys in English (camelCase).
* Support any number of locales dynamically.
* Ensure the AI outputs valid JSON only, with no explanations or markdown.

## 0.1.2

* Minor Fixes

## 0.1.1

* Added `.i18nizer` folder in project root for CLI data
  * `.i18nizer/tsconfig.json` for isolated TypeScript analysis
  * `.i18nizer/api-keys.json` for storing API keys locally per project
  * `.i18nizer/messages/` to store generated locale JSON files
* Automatically creates default `tsconfig.json` and `api-keys.json` if they do not exist
* Ensures CLI works independently of user project tsconfig
  
## 0.1.0

* Initial release
* Supported AI providers: OpenAI, Hugging Face, Gemini
* CLI works with JSX and TSX files
* Console logs show paths of saved locale files
* Ensures CLI works independently of user project tsconfig
