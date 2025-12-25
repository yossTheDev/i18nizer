import { expect } from 'chai';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

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
});
