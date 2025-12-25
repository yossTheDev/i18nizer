import { expect } from "chai";

import { componentNameToFilename, filenameToIdentifier } from "../../../src/core/i18n/filename-utils.js";

describe("filename-utils", () => {
  describe("componentNameToFilename", () => {
    it("should convert PascalCase to lowercase-hyphen format", () => {
      expect(componentNameToFilename("NotificationItem")).to.equal("notification-item");
      expect(componentNameToFilename("CollapsibleText")).to.equal("collapsible-text");
      expect(componentNameToFilename("DeleteModel")).to.equal("delete-model");
    });

    it("should handle single word components", () => {
      expect(componentNameToFilename("Button")).to.equal("button");
      expect(componentNameToFilename("Form")).to.equal("form");
    });

    it("should handle camelCase input", () => {
      expect(componentNameToFilename("notificationItem")).to.equal("notification-item");
      expect(componentNameToFilename("collapsibleText")).to.equal("collapsible-text");
    });

    it("should handle multi-word PascalCase", () => {
      expect(componentNameToFilename("CollectionOnlineStatusColumn")).to.equal("collection-online-status-column");
      expect(componentNameToFilename("EditPermissionsDialog")).to.equal("edit-permissions-dialog");
    });

    it("should handle already lowercase input", () => {
      expect(componentNameToFilename("button")).to.equal("button");
      expect(componentNameToFilename("form")).to.equal("form");
    });
  });

  describe("filenameToIdentifier", () => {
    it("should convert lowercase-hyphen to PascalCase", () => {
      expect(filenameToIdentifier("notification-item")).to.equal("NotificationItem");
      expect(filenameToIdentifier("collapsible-text")).to.equal("CollapsibleText");
      expect(filenameToIdentifier("delete-model")).to.equal("DeleteModel");
    });

    it("should handle single word filenames", () => {
      expect(filenameToIdentifier("button")).to.equal("Button");
      expect(filenameToIdentifier("form")).to.equal("Form");
    });

    it("should handle multi-word filenames", () => {
      expect(filenameToIdentifier("collection-online-status-column")).to.equal("CollectionOnlineStatusColumn");
      expect(filenameToIdentifier("edit-permissions-dialog")).to.equal("EditPermissionsDialog");
    });

    it("should handle already PascalCase input", () => {
      expect(filenameToIdentifier("Button")).to.equal("Button");
      expect(filenameToIdentifier("Form")).to.equal("Form");
    });

    it("should be inverse of componentNameToFilename", () => {
      const testNames = [
        "NotificationItem",
        "CollapsibleText",
        "DeleteModel",
        "Button",
        "CollectionOnlineStatusColumn",
        "EditPermissionsDialog",
      ];

      for (const name of testNames) {
        const filename = componentNameToFilename(name);
        const identifier = filenameToIdentifier(filename);
        expect(identifier).to.equal(name);
      }
    });
  });
});
