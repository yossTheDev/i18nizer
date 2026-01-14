import { expect } from 'chai';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import yaml from 'js-yaml';

import {
  detectFramework,
  generateConfig,
  getMessagesDir,
  getProjectDir,
  isProjectInitialized,
  loadConfig,
  writeConfig,
} from '../../../src/core/config/config-manager.js';
import { Framework } from '../../../src/types/config.js';

describe('Config Manager', () => {
  let testDir: string;

  beforeEach(() => {
    // Create a temporary test directory
    testDir = path.join(os.tmpdir(), `i18nizer-test-${Date.now()}`);
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('detectFramework', () => {
    it('should detect Next.js from package.json', () => {
      const packageJson = {
        dependencies: {
          next: '^14.0.0',
          'next-intl': '^3.0.0',
          react: '^18.0.0',
        },
      };
      fs.writeFileSync(
        path.join(testDir, 'package.json'),
        JSON.stringify(packageJson)
      );

      const framework = detectFramework(testDir);
      expect(framework).to.equal('nextjs');
    });

    it('should detect React from package.json', () => {
      const packageJson = {
        dependencies: {
          react: '^18.0.0',
          'react-i18next': '^12.0.0',
        },
      };
      fs.writeFileSync(
        path.join(testDir, 'package.json'),
        JSON.stringify(packageJson)
      );

      const framework = detectFramework(testDir);
      expect(framework).to.equal('react');
    });

    it('should default to React if no package.json', () => {
      const framework = detectFramework(testDir);
      expect(framework).to.equal('react');
    });
  });

  describe('generateConfig', () => {
    it('should generate Next.js config', () => {
      const config = generateConfig('nextjs');
      expect(config.framework).to.equal('nextjs');
      expect(config.i18n.import.source).to.equal('next-intl');
      expect(config.i18n.import.named).to.equal('useTranslations');
    });

    it('should generate React config', () => {
      const config = generateConfig('react');
      expect(config.framework).to.equal('react');
      expect(config.i18n.import.source).to.equal('react-i18next');
      expect(config.i18n.import.named).to.equal('useTranslation');
    });

    it('should include default behavior settings', () => {
      const config = generateConfig('react');
      expect(config.behavior.detectDuplicates).to.be.true;
      expect(config.behavior.opinionatedStructure).to.be.true;
      expect(config.behavior.allowedFunctions).to.include('alert');
      expect(config.behavior.allowedProps).to.include('placeholder');
    });
  });

  describe('writeConfig and loadConfig', () => {
    it('should write and load config correctly', () => {
      const config = generateConfig('nextjs');
      writeConfig(testDir, config);

      const loadedConfig = loadConfig(testDir);
      expect(loadedConfig).to.not.be.null;
      expect(loadedConfig!.framework).to.equal('nextjs');
      expect(loadedConfig!.i18n.function).to.equal('t');
    });

    it('should return null if config does not exist', () => {
      const loadedConfig = loadConfig(testDir);
      expect(loadedConfig).to.be.null;
    });

    it('should write valid YAML', () => {
      const config = generateConfig('react');
      writeConfig(testDir, config);

      const configPath = path.join(testDir, 'i18nizer.config.yml');
      const content = fs.readFileSync(configPath, 'utf8');
      
      expect(content).to.include('framework: react');
      expect(content).to.include('function: t');
      expect(content).to.include('detectDuplicates: true');
    });
  });

  describe('isProjectInitialized', () => {
    it('should return false if config does not exist', () => {
      expect(isProjectInitialized(testDir)).to.be.false;
    });

    it('should return true if config exists', () => {
      const config = generateConfig('react');
      writeConfig(testDir, config);
      expect(isProjectInitialized(testDir)).to.be.true;
    });
  });

  describe('getProjectDir', () => {
    it('should create .i18nizer directory if it does not exist', () => {
      const projectDir = getProjectDir(testDir);
      expect(fs.existsSync(projectDir)).to.be.true;
      expect(path.basename(projectDir)).to.equal('.i18nizer');
    });

    it('should return existing .i18nizer directory', () => {
      const expectedDir = path.join(testDir, '.i18nizer');
      fs.mkdirSync(expectedDir);
      
      const projectDir = getProjectDir(testDir);
      expect(projectDir).to.equal(expectedDir);
    });
  });

  describe('getMessagesDir', () => {
    it('should create messages directory based on config', () => {
      const config = generateConfig('react');
      const messagesDir = getMessagesDir(testDir, config);
      
      expect(fs.existsSync(messagesDir)).to.be.true;
      expect(messagesDir).to.include('messages');
    });

    it('should handle custom messages path', () => {
      const config = generateConfig('react');
      config.messages.path = 'locales';
      
      const messagesDir = getMessagesDir(testDir, config);
      expect(fs.existsSync(messagesDir)).to.be.true;
      expect(path.basename(messagesDir)).to.equal('locales');
    });
  });

  describe('AI provider configuration', () => {
    it('should include default AI provider and model in config', () => {
      const config = generateConfig('react');
      expect(config.ai).to.not.be.undefined;
      expect(config.ai!.provider).to.equal('openai');
      expect(config.ai!.model).to.equal('gpt-4');
    });

    it('should write and load AI configuration correctly', () => {
      const config = generateConfig('react');
      config.ai = { provider: 'gemini', model: 'gemini-pro' };
      writeConfig(testDir, config);

      const loadedConfig = loadConfig(testDir);
      expect(loadedConfig).to.not.be.null;
      expect(loadedConfig!.ai).to.not.be.undefined;
      expect(loadedConfig!.ai!.provider).to.equal('gemini');
      expect(loadedConfig!.ai!.model).to.equal('gemini-pro');
    });

    it('should validate AI provider and throw error for invalid provider', () => {
      const config = generateConfig('react');
      config.ai = { provider: 'invalid' as any, model: 'some-model' };
      writeConfig(testDir, config);

      expect(() => loadConfig(testDir)).to.throw(/Invalid AI provider/);
    });

    it('should accept valid AI providers', () => {
      const validProviders = ['openai', 'gemini', 'huggingface'];
      
      for (const provider of validProviders) {
        const config = generateConfig('react');
        config.ai = { provider: provider as any, model: 'test-model' };
        writeConfig(testDir, config);

        const loadedConfig = loadConfig(testDir);
        expect(loadedConfig).to.not.be.null;
        expect(loadedConfig!.ai!.provider).to.equal(provider);
      }
    });
  });

  describe('Paths configuration', () => {
    it('should include default paths in config', () => {
      const config = generateConfig('react');
      expect(config.paths).to.not.be.undefined;
      expect(config.paths!.src).to.equal('src');
      expect(config.paths!.i18n).to.equal('i18n');
    });

    it('should write and load paths configuration correctly', () => {
      const config = generateConfig('react');
      config.paths = { src: 'source', i18n: 'locales' };
      writeConfig(testDir, config);

      const loadedConfig = loadConfig(testDir);
      expect(loadedConfig).to.not.be.null;
      expect(loadedConfig!.paths).to.not.be.undefined;
      expect(loadedConfig!.paths!.src).to.equal('source');
      expect(loadedConfig!.paths!.i18n).to.equal('locales');
    });

    it('should merge paths configuration with defaults', () => {
      const config = generateConfig('react');
      config.paths = { src: 'custom-src', i18n: 'i18n' };
      writeConfig(testDir, config);

      const loadedConfig = loadConfig(testDir);
      expect(loadedConfig).to.not.be.null;
      expect(loadedConfig!.paths!.src).to.equal('custom-src');
      expect(loadedConfig!.paths!.i18n).to.equal('i18n');
    });
  });

  describe('Backward compatibility', () => {
    it('should load old config without AI settings', () => {
      const oldConfig = {
        framework: 'react' as Framework,
        i18n: {
          function: 't',
          import: { source: 'react-i18next', named: 'useTranslation' }
        },
        messages: {
          path: 'messages',
          defaultLocale: 'en',
          locales: ['en', 'es'],
          format: 'json' as const
        },
        behavior: {
          detectDuplicates: true,
          opinionatedStructure: true,
          autoInjectT: true,
          useAiForKeys: true,
          allowedFunctions: ['alert'],
          allowedMemberFunctions: [],
          allowedProps: ['placeholder']
        }
      };

      const configPath = path.join(testDir, 'i18nizer.config.yml');
      fs.writeFileSync(configPath, yaml.dump(oldConfig), 'utf8');

      const loadedConfig = loadConfig(testDir);
      expect(loadedConfig).to.not.be.null;
      expect(loadedConfig!.ai).to.not.be.undefined;
      expect(loadedConfig!.ai!.provider).to.equal('openai'); // Default from merge
      expect(loadedConfig!.paths).to.not.be.undefined;
      expect(loadedConfig!.paths!.src).to.equal('src'); // Default from merge
    });

    it('should load old config without paths settings', () => {
      const oldConfig = {
        framework: 'react' as Framework,
        ai: { provider: 'gemini', model: 'gemini-pro' },
        i18n: {
          function: 't',
          import: { source: 'react-i18next', named: 'useTranslation' }
        },
        messages: {
          path: 'messages',
          defaultLocale: 'en',
          locales: ['en', 'es'],
          format: 'json' as const
        },
        behavior: {
          detectDuplicates: true,
          opinionatedStructure: true,
          autoInjectT: true,
          useAiForKeys: true,
          allowedFunctions: ['alert'],
          allowedMemberFunctions: [],
          allowedProps: ['placeholder']
        }
      };

      const configPath = path.join(testDir, 'i18nizer.config.yml');
      fs.writeFileSync(configPath, yaml.dump(oldConfig), 'utf8');

      const loadedConfig = loadConfig(testDir);
      expect(loadedConfig).to.not.be.null;
      expect(loadedConfig!.paths).to.not.be.undefined;
      expect(loadedConfig!.paths!.src).to.equal('src'); // Default from merge
      expect(loadedConfig!.paths!.i18n).to.equal('i18n'); // Default from merge
    });
  });
});
