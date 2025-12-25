/**
 * Utility functions for handling filename conversions for i18nizer.
 * 
 * JSON files use lowercase-hyphen format (e.g., "notification-item.json")
 * TypeScript identifiers use PascalCase (e.g., "NotificationItem_en")
 */

/**
 * Convert a component name to a valid JSON filename (lowercase with hyphens).
 * 
 * @param componentName - The component name (e.g., "NotificationItem", "CollapsibleText")
 * @returns Lowercase hyphenated filename without extension (e.g., "notification-item", "collapsible-text")
 * 
 * @example
 * componentNameToFilename("NotificationItem") // "notification-item"
 * componentNameToFilename("CollapsibleText") // "collapsible-text"
 * componentNameToFilename("DeleteModel") // "delete-model"
 */
export function componentNameToFilename(componentName: string): string {
  // Convert PascalCase/camelCase to lowercase-hyphen format
  return componentName
    // Insert hyphen before uppercase letters (except first)
    .replace(/([A-Z])/g, (match, letter, index) => {
      return index === 0 ? letter.toLowerCase() : `-${letter.toLowerCase()}`;
    })
    // Remove leading hyphen if any
    .replace(/^-/, "");
}

/**
 * Convert a filename to a valid TypeScript identifier (PascalCase).
 * 
 * @param filename - The filename without extension (e.g., "notification-item", "collapsible-text")
 * @returns PascalCase identifier (e.g., "NotificationItem", "CollapsibleText")
 * 
 * @example
 * filenameToIdentifier("notification-item") // "NotificationItem"
 * filenameToIdentifier("collapsible-text") // "CollapsibleText"
 * filenameToIdentifier("delete-model") // "DeleteModel"
 */
export function filenameToIdentifier(filename: string): string {
  // Split by hyphens and convert to PascalCase
  return filename
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}
