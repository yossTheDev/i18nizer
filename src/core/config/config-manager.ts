import fs from "node:fs";
import path from "node:path";

import yaml from "js-yaml";

import { DEFAULT_CONFIG, FRAMEWORK_PRESETS, Framework, I18nizerConfig } from "../../types/config.js";

const CONFIG_FILE_NAME = "i18nizer.config.yml";
const PROJECT_DIR_NAME = ".i18nizer";

/**
 * Detect project type by looking for framework-specific files
 */
export function detectFramework(cwd: string): Framework {
  const packageJsonPath = path.join(cwd, "package.json");
  
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (deps["next"] || deps["next-intl"]) {
        return "nextjs";
      }
      
      if (deps["react"] || deps["react-i18next"]) {
        return "react";
      }
    } catch {
      // Ignore parse errors
    }
  }
  
  return "react"; // Default fallback
}

/**
 * Load configuration from the project root
 */
export function loadConfig(cwd: string): I18nizerConfig | null {
  const configPath = path.join(cwd, CONFIG_FILE_NAME);
  
  if (!fs.existsSync(configPath)) {
    return null;
  }
  
  try {
    const fileContent = fs.readFileSync(configPath, "utf8");
    const parsed = yaml.load(fileContent) as Partial<I18nizerConfig>;
    
    // Deep merge with defaults
    return mergeConfig(DEFAULT_CONFIG, parsed);
  } catch (error) {
    throw new Error(`Failed to parse config file: ${(error as Error).message}`);
  }
}

/**
 * Deep merge configuration objects
 */
function mergeConfig(base: I18nizerConfig, override: Partial<I18nizerConfig>): I18nizerConfig {
  return {
    behavior: {
      ...base.behavior,
      ...override.behavior,
    },
    framework: override.framework ?? base.framework,
    i18n: {
      ...base.i18n,
      ...override.i18n,
      import: {
        ...base.i18n.import,
        ...(override.i18n?.import ?? {}),
      },
    },
    messages: {
      ...base.messages,
      ...override.messages,
    },
  };
}

/**
 * Generate config based on framework preset
 */
export function generateConfig(framework: Framework): I18nizerConfig {
  const preset = FRAMEWORK_PRESETS[framework];
  return mergeConfig(DEFAULT_CONFIG, preset);
}

/**
 * Write config to file
 */
export function writeConfig(cwd: string, config: I18nizerConfig): void {
  const configPath = path.join(cwd, CONFIG_FILE_NAME);
  const yamlContent = yaml.dump(config, {
    indent: 2,
    lineWidth: 100,
    noRefs: true,
  });
  
  fs.writeFileSync(configPath, yamlContent, "utf8");
}

/**
 * Get or create project directory (.i18nizer)
 */
export function getProjectDir(cwd: string): string {
  const projectDir = path.join(cwd, PROJECT_DIR_NAME);
  
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }
  
  return projectDir;
}

/**
 * Get messages directory based on config
 */
export function getMessagesDir(cwd: string, config: I18nizerConfig): string {
  const messagesDir = path.resolve(cwd, config.messages.path);
  
  if (!fs.existsSync(messagesDir)) {
    fs.mkdirSync(messagesDir, { recursive: true });
  }
  
  return messagesDir;
}

/**
 * Check if project is initialized (has config file)
 */
export function isProjectInitialized(cwd: string): boolean {
  return fs.existsSync(path.join(cwd, CONFIG_FILE_NAME));
}
