import { expect } from "chai";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { ensureI18nizerDirInGitignore } from "../../../src/core/config/gitignore-manager.js";

describe("ensureI18nizerDirInGitignore", () => {
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
    const i18nizerDirPath = path.join(testDir, ".i18nizer");

    if (fs.existsSync(gitignorePath)) {
      fs.unlinkSync(gitignorePath);
    }

    if (fs.existsSync(i18nizerDirPath)) {
      fs.rmSync(i18nizerDirPath, { force: true, recursive: true });
    }
  });

  it("should add .i18nizer/ to .gitignore when directory exists and not already ignored", () => {
    // Create .i18nizer directory
    const i18nizerDirPath = path.join(testDir, ".i18nizer");
    fs.mkdirSync(i18nizerDirPath, { recursive: true });

    // Create .gitignore without .i18nizer/
    const gitignorePath = path.join(testDir, ".gitignore");
    fs.writeFileSync(gitignorePath, "node_modules/\n", "utf8");

    // Run function
    const result = ensureI18nizerDirInGitignore(testDir);

    // Verify
    expect(result).to.be.true;
    const content = fs.readFileSync(gitignorePath, "utf8");
    expect(content).to.include(".i18nizer/");
  });

  it("should create .gitignore if it does not exist", () => {
    // Create .i18nizer directory
    const i18nizerDirPath = path.join(testDir, ".i18nizer");
    fs.mkdirSync(i18nizerDirPath, { recursive: true });

    const gitignorePath = path.join(testDir, ".gitignore");
    expect(fs.existsSync(gitignorePath)).to.be.false;

    // Run function
    const result = ensureI18nizerDirInGitignore(testDir);

    // Verify
    expect(result).to.be.true;
    expect(fs.existsSync(gitignorePath)).to.be.true;
    const content = fs.readFileSync(gitignorePath, "utf8");
    expect(content).to.include(".i18nizer/");
  });

  it("should return false when .i18nizer directory does not exist", () => {
    const gitignorePath = path.join(testDir, ".gitignore");
    fs.writeFileSync(gitignorePath, "node_modules/\n", "utf8");

    // Run function without .i18nizer directory
    const result = ensureI18nizerDirInGitignore(testDir);

    // Verify
    expect(result).to.be.false;
    const content = fs.readFileSync(gitignorePath, "utf8");
    expect(content).to.not.include(".i18nizer/");
  });

  it("should return false when .i18nizer/ is already in .gitignore (exact match)", () => {
    // Create .i18nizer directory
    const i18nizerDirPath = path.join(testDir, ".i18nizer");
    fs.mkdirSync(i18nizerDirPath, { recursive: true });

    // Create .gitignore with .i18nizer/ already present
    const gitignorePath = path.join(testDir, ".gitignore");
    fs.writeFileSync(gitignorePath, "node_modules/\n.i18nizer/\n", "utf8");

    // Run function
    const result = ensureI18nizerDirInGitignore(testDir);

    // Verify
    expect(result).to.be.false;
    const content = fs.readFileSync(gitignorePath, "utf8");
    // Count occurrences - should be exactly 1
    const matches = content.match(/\.i18nizer/g);
    expect(matches).to.not.be.null;
    expect(matches!.length).to.equal(1);
  });

  it("should return false when .i18nizer/ is already ignored with leading slash", () => {
    // Create .i18nizer directory
    const i18nizerDirPath = path.join(testDir, ".i18nizer");
    fs.mkdirSync(i18nizerDirPath, { recursive: true });

    // Create .gitignore with .i18nizer/ already present (with leading slash)
    const gitignorePath = path.join(testDir, ".gitignore");
    fs.writeFileSync(gitignorePath, "node_modules/\n/.i18nizer/\n", "utf8");

    // Run function
    const result = ensureI18nizerDirInGitignore(testDir);

    // Verify
    expect(result).to.be.false;
    const content = fs.readFileSync(gitignorePath, "utf8");
    // Count occurrences - should be exactly 1
    const matches = content.match(/\.i18nizer/g);
    expect(matches).to.not.be.null;
    expect(matches!.length).to.equal(1);
  });

  it("should return false when .i18nizer is already ignored without trailing slash", () => {
    // Create .i18nizer directory
    const i18nizerDirPath = path.join(testDir, ".i18nizer");
    fs.mkdirSync(i18nizerDirPath, { recursive: true });

    // Create .gitignore with .i18nizer already present (without trailing slash)
    const gitignorePath = path.join(testDir, ".gitignore");
    fs.writeFileSync(gitignorePath, "node_modules/\n.i18nizer\n", "utf8");

    // Run function
    const result = ensureI18nizerDirInGitignore(testDir);

    // Verify
    expect(result).to.be.false;
    const content = fs.readFileSync(gitignorePath, "utf8");
    // Count occurrences - should be exactly 1
    const matches = content.match(/\.i18nizer/g);
    expect(matches).to.not.be.null;
    expect(matches!.length).to.equal(1);
  });

  it("should preserve existing .gitignore content when adding .i18nizer/", () => {
    // Create .i18nizer directory
    const i18nizerDirPath = path.join(testDir, ".i18nizer");
    fs.mkdirSync(i18nizerDirPath, { recursive: true });

    // Create .gitignore with existing content
    const gitignorePath = path.join(testDir, ".gitignore");
    const existingContent = "node_modules/\n*.log\ndist/\n";
    fs.writeFileSync(gitignorePath, existingContent, "utf8");

    // Run function
    ensureI18nizerDirInGitignore(testDir);

    // Verify
    const content = fs.readFileSync(gitignorePath, "utf8");
    expect(content).to.include("node_modules/");
    expect(content).to.include("*.log");
    expect(content).to.include("dist/");
    expect(content).to.include(".i18nizer/");
  });

  it("should handle empty .gitignore file", () => {
    // Create .i18nizer directory
    const i18nizerDirPath = path.join(testDir, ".i18nizer");
    fs.mkdirSync(i18nizerDirPath, { recursive: true });

    // Create empty .gitignore
    const gitignorePath = path.join(testDir, ".gitignore");
    fs.writeFileSync(gitignorePath, "", "utf8");

    // Run function
    const result = ensureI18nizerDirInGitignore(testDir);

    // Verify
    expect(result).to.be.true;
    const content = fs.readFileSync(gitignorePath, "utf8");
    expect(content).to.equal(".i18nizer/\n");
  });
});
