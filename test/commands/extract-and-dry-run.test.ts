import { expect } from 'chai';
import yaml from 'js-yaml';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cliPath = fileURLToPath(new URL('../../bin/run.js', import.meta.url));
const inlangSchemaUrl = 'https://inlang.com/schema/inlang-message-format';

describe('extract and dry-run integration', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = path.join(os.tmpdir(), `i18nizer-cli-test-${Date.now()}`);
    fs.mkdirSync(path.join(testDir, 'src'), { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { force: true, recursive: true });
    }
  });

  function runCli(args: string[]) {
    return spawnSync(process.execPath, [cliPath, ...args], {
      cwd: testDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        FORCE_COLOR: '0',
      },
    });
  }

  function writeConfig(config: Record<string, unknown>) {
    fs.writeFileSync(
      path.join(testDir, 'i18nizer.config.yml'),
      yaml.dump(config),
      'utf8'
    );
  }

  function createLegacyConfig() {
    return {
      behavior: {
        allowedFunctions: ['alert', 'confirm', 'prompt'],
        allowedMemberFunctions: ['toast.error', 'toast.info', 'toast.success', 'toast.warn'],
        allowedProps: ['alt', 'aria-label', 'aria-placeholder', 'helperText', 'label', 'placeholder', 'text', 'title', 'tooltip'],
        autoInjectT: true,
        detectDuplicates: true,
        opinionatedStructure: true,
        useAiForKeys: false,
      },
      framework: 'react',
      i18n: {
        function: 't',
        import: {
          named: 'useTranslation',
          source: 'react-i18next',
        },
      },
      i18nLibrary: 'react-i18next',
      messages: {
        defaultLocale: 'en',
        format: 'json',
        locales: ['en'],
        path: 'messages',
      },
    };
  }

  function createParaglideConfig() {
    return {
      behavior: {
        allowedFunctions: ['alert', 'confirm', 'prompt'],
        allowedMemberFunctions: ['toast.error', 'toast.info', 'toast.success', 'toast.warn'],
        allowedProps: ['alt', 'aria-label', 'aria-placeholder', 'helperText', 'label', 'placeholder', 'text', 'title', 'tooltip'],
        autoInjectT: true,
        detectDuplicates: true,
        opinionatedStructure: true,
        useAiForKeys: false,
      },
      framework: 'react',
      i18n: {
        function: 'm',
        import: {
          named: 'm',
          source: './paraglide/messages.js',
        },
      },
      i18nLibrary: 'paraglide-js',
      messages: {
        defaultLocale: 'en',
        format: 'inlang-message-format',
        locales: ['en'],
        path: 'messages',
      },
    };
  }

  it('should run translate --dry-run without AI and without writing project files', () => {
    const componentPath = path.join(testDir, 'src', 'LoginForm.tsx');
    const originalSource = `
      export default function LoginForm() {
        return <button>Sign in</button>;
      }
    `;

    fs.writeFileSync(componentPath, originalSource, 'utf8');
    writeConfig(createLegacyConfig());

    const result = runCli(['translate', 'src/LoginForm.tsx', '--dry-run', '--locales', 'en']);

    expect(result.status, `${result.stdout}\n${result.stderr}`).to.equal(0);
    expect(fs.readFileSync(componentPath, 'utf8')).to.equal(originalSource);
    expect(fs.existsSync(path.join(testDir, '.i18nizer'))).to.be.false;
    expect(fs.existsSync(path.join(testDir, 'messages'))).to.be.false;
  });

  it('should run extract without AI and write only the default locale in legacy JSON format', () => {
    const componentPath = path.join(testDir, 'src', 'LoginForm.tsx');
    const originalSource = `
      export default function LoginForm() {
        return <button>Sign in</button>;
      }
    `;

    fs.writeFileSync(componentPath, originalSource, 'utf8');
    writeConfig(createLegacyConfig());

    const result = runCli(['extract', 'src/LoginForm.tsx', '--locales', 'en,es']);
    const messagePath = path.join(testDir, 'messages', 'en', 'login-form.json');

    expect(result.status, `${result.stdout}\n${result.stderr}`).to.equal(0);
    expect(fs.readFileSync(componentPath, 'utf8')).to.equal(originalSource);
    expect(fs.existsSync(messagePath)).to.be.true;
    expect(JSON.parse(fs.readFileSync(messagePath, 'utf8'))).to.deep.equal({
      LoginForm: {
        signIn: 'Sign in',
      },
    });
    expect(fs.existsSync(path.join(testDir, 'messages', 'es'))).to.be.false;
  });

  it('should run extract without AI and emit Paraglide inlang-message-format files out of the box', () => {
    const componentPath = path.join(testDir, 'src', 'LoginForm.tsx');
    const originalSource = `
      export default function LoginForm() {
        return <button>Sign in</button>;
      }
    `;

    fs.writeFileSync(componentPath, originalSource, 'utf8');
    writeConfig(createParaglideConfig());

    const result = runCli(['extract', 'src/LoginForm.tsx', '--locales', 'en,es']);
    const messagePath = path.join(testDir, 'messages', 'en.json');

    expect(result.status, `${result.stdout}\n${result.stderr}`).to.equal(0);
    expect(fs.readFileSync(componentPath, 'utf8')).to.equal(originalSource);
    expect(fs.existsSync(messagePath)).to.be.true;
    expect(JSON.parse(fs.readFileSync(messagePath, 'utf8'))).to.deep.equal({
      $schema: inlangSchemaUrl,
      sign_in: 'Sign in',
    });
    expect(fs.existsSync(path.join(testDir, 'messages', 'es.json'))).to.be.false;
    expect(fs.existsSync(path.join(testDir, 'messages', 'en', 'login-form.json'))).to.be.false;
  });
});
