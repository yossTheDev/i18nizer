import { expect } from "chai";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { ensureConfigInGitignore } from "../../../src/core/config/gitignore-manager.js";

describe("ensureConfigInGitignore", () => {
  const testDir = path.join(os.tmpdir(), "i18nizer-gitignore-test-" + Date.now());

  before(() => {
    // Create test directory
    fs.mkdirSync(testDir, { recursive: true });
  });

  after(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { force: true, recursive: true });
    }
  });

  afterEach(() => {
    // Clean up after each test
    const gitignorePath = path.join(testDir, ".gitignore");
    const configPath = path.join(testDir, "i18nizer.config.yml");

    if (fs.existsSync(gitignorePath)) {
      fs.unlinkSync(gitignorePath);
    }

    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  });

  it("should add config to .gitignore when config exists and not already ignored", () => {
    // Create config file
    const configPath = path.join(testDir, "i18nizer.config.yml");
    fs.writeFileSync(configPath, "framework: react\n", "utf8");

    // Create .gitignore without config
    const gitignorePath = path.join(testDir, ".gitignore");
    fs.writeFileSync(gitignorePath, "node_modules/\n", "utf8");

    // Run function
    const result = ensureConfigInGitignore(testDir);

    // Verify
    expect(result).to.be.true;
    const content = fs.readFileSync(gitignorePath, "utf8");
    expect(content).to.include("i18nizer.config.yml");
  });

  it("should create .gitignore if it does not exist", () => {
    // Create config file
    const configPath = path.join(testDir, "i18nizer.config.yml");
    fs.writeFileSync(configPath, "framework: react\n", "utf8");

    const gitignorePath = path.join(testDir, ".gitignore");
    expect(fs.existsSync(gitignorePath)).to.be.false;

    // Run function
    const result = ensureConfigInGitignore(testDir);

    // Verify
    expect(result).to.be.true;
    expect(fs.existsSync(gitignorePath)).to.be.true;
    const content = fs.readFileSync(gitignorePath, "utf8");
    expect(content).to.include("i18nizer.config.yml");
  });

  it("should return false when config file does not exist", () => {
    const gitignorePath = path.join(testDir, ".gitignore");
    fs.writeFileSync(gitignorePath, "node_modules/\n", "utf8");

    // Run function without config file
    const result = ensureConfigInGitignore(testDir);

    // Verify
    expect(result).to.be.false;
    const content = fs.readFileSync(gitignorePath, "utf8");
    expect(content).to.not.include("i18nizer.config.yml");
  });

  it("should return false when config is already in .gitignore (exact match)", () => {
    // Create config file
    const configPath = path.join(testDir, "i18nizer.config.yml");
    fs.writeFileSync(configPath, "framework: react\n", "utf8");

    // Create .gitignore with config already present
    const gitignorePath = path.join(testDir, ".gitignore");
    fs.writeFileSync(gitignorePath, "node_modules/\ni18nizer.config.yml\n", "utf8");

    // Run function
    const result = ensureConfigInGitignore(testDir);

    // Verify
    expect(result).to.be.false;
    const content = fs.readFileSync(gitignorePath, "utf8");
    // Count occurrences - should be exactly 1
    const matches = content.match(/i18nizer\.config\.yml/g);
    expect(matches).to.not.be.null;
    expect(matches!.length).to.equal(1);
  });

  it("should return false when config is already ignored with leading slash", () => {
    // Create config file
    const configPath = path.join(testDir, "i18nizer.config.yml");
    fs.writeFileSync(configPath, "framework: react\n", "utf8");

    // Create .gitignore with config already present (with leading slash)
    const gitignorePath = path.join(testDir, ".gitignore");
    fs.writeFileSync(gitignorePath, "node_modules/\n/i18nizer.config.yml\n", "utf8");

    // Run function
    const result = ensureConfigInGitignore(testDir);

    // Verify
    expect(result).to.be.false;
    const content = fs.readFileSync(gitignorePath, "utf8");
    // Count occurrences - should be exactly 1
    const matches = content.match(/i18nizer\.config\.yml/g);
    expect(matches).to.not.be.null;
    expect(matches!.length).to.equal(1);
  });

  it("should return false when config is already ignored with wildcard pattern", () => {
    // Create config file
    const configPath = path.join(testDir, "i18nizer.config.yml");
    fs.writeFileSync(configPath, "framework: react\n", "utf8");

    // Create .gitignore with config already present (with wildcard pattern)
    const gitignorePath = path.join(testDir, ".gitignore");
    fs.writeFileSync(gitignorePath, "node_modules/\n**/i18nizer.config.yml\n", "utf8");

    // Run function
    const result = ensureConfigInGitignore(testDir);

    // Verify
    expect(result).to.be.false;
    const content = fs.readFileSync(gitignorePath, "utf8");
    // Count occurrences - should be exactly 1
    const matches = content.match(/i18nizer\.config\.yml/g);
    expect(matches).to.not.be.null;
    expect(matches!.length).to.equal(1);
  });

  it("should preserve existing .gitignore content when adding config", () => {
    // Create config file
    const configPath = path.join(testDir, "i18nizer.config.yml");
    fs.writeFileSync(configPath, "framework: react\n", "utf8");

    // Create .gitignore with existing content
    const gitignorePath = path.join(testDir, ".gitignore");
    const existingContent = "node_modules/\n*.log\ndist/\n";
    fs.writeFileSync(gitignorePath, existingContent, "utf8");

    // Run function
    ensureConfigInGitignore(testDir);

    // Verify
    const content = fs.readFileSync(gitignorePath, "utf8");
    expect(content).to.include("node_modules/");
    expect(content).to.include("*.log");
    expect(content).to.include("dist/");
    expect(content).to.include("i18nizer.config.yml");
  });

  it("should handle empty .gitignore file", () => {
    // Create config file
    const configPath = path.join(testDir, "i18nizer.config.yml");
    fs.writeFileSync(configPath, "framework: react\n", "utf8");

    // Create empty .gitignore
    const gitignorePath = path.join(testDir, ".gitignore");
    fs.writeFileSync(gitignorePath, "", "utf8");

    // Run function
    const result = ensureConfigInGitignore(testDir);

    // Verify
    expect(result).to.be.true;
    const content = fs.readFileSync(gitignorePath, "utf8");
    expect(content).to.equal("i18nizer.config.yml\n");
  });
});
