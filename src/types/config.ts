/**
 * Configuration types for i18nizer
 */

export type Framework = "nextjs" | "react" | "custom";
export type I18nLibrary = "next-intl" | "react-i18next" | "i18next" | "custom";

export interface I18nizerConfig {
  framework: Framework;
  i18nLibrary?: I18nLibrary; // Optional field to track detected library
  i18n: {
    function: string;
    import: {
      source: string;
      named: string;
    };
  };
  messages: {
    path: string;
    defaultLocale: string;
    format: "json";
  };
  behavior: {
    detectDuplicates: boolean;
    opinionatedStructure: boolean;
    allowedFunctions: string[];
    allowedMemberFunctions: string[];
    allowedProps: string[];
  };
}

export const DEFAULT_CONFIG: I18nizerConfig = {
  behavior: {
    allowedFunctions: ["alert", "confirm", "prompt"],
    allowedMemberFunctions: ["toast.error", "toast.info", "toast.success", "toast.warn"],
    allowedProps: [
      "alt",
      "aria-label",
      "aria-placeholder",
      "helperText",
      "label",
      "placeholder",
      "text",
      "title",
      "tooltip",
    ],
    detectDuplicates: true,
    opinionatedStructure: true,
  },
  framework: "react",
  i18n: {
    function: "t",
    import: {
      named: "useTranslations",
      source: "next-intl",
    },
  },
  messages: {
    defaultLocale: "en",
    format: "json",
    path: "messages",
  },
};

export const FRAMEWORK_PRESETS: Record<Framework, Partial<I18nizerConfig>> = {
  custom: {},
  nextjs: {
    framework: "nextjs",
    i18nLibrary: "next-intl",
    i18n: {
      function: "t",
      import: {
        named: "useTranslations",
        source: "next-intl",
      },
    },
  },
  react: {
    framework: "react",
    i18nLibrary: "react-i18next",
    i18n: {
      function: "t",
      import: {
        named: "useTranslation",
        source: "react-i18next",
      },
    },
  },
};

/**
 * I18n library-specific configurations
 */
export const I18N_LIBRARY_CONFIGS: Record<I18nLibrary, Partial<I18nizerConfig>> = {
  "next-intl": {
    i18nLibrary: "next-intl",
    i18n: {
      function: "t",
      import: {
        named: "useTranslations",
        source: "next-intl",
      },
    },
  },
  "react-i18next": {
    i18nLibrary: "react-i18next",
    i18n: {
      function: "t",
      import: {
        named: "useTranslation",
        source: "react-i18next",
      },
    },
  },
  "i18next": {
    i18nLibrary: "i18next",
    i18n: {
      function: "t",
      import: {
        named: "useTranslation",
        source: "react-i18next", // Default to react-i18next for React apps
      },
    },
  },
  custom: {
    i18nLibrary: "custom",
    i18n: {
      function: "t",
      import: {
        named: "useTranslations",
        source: "next-intl",
      },
    },
  },
};
