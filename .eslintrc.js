// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },

  ignorePatterns: ["/dist/*"],

  extends: ["expo", "eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  plugins: ["@typescript-eslint", "prettier", "simple-import-sort"],

  rules: {
    camelcase: 2,

    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Side effect imports
          ["^\\u0000"],
          // Node.js builtins
          ["^node:"],
          // Packages
          ["^react", "^@?\\w"],
          // @/contexts and its types
          ["^@/contexts/", "^type:@/contexts/"],
          // @/components and its types
          ["^@/components/", "^type:@/components/"],
          // @/layouts and its types
          ["^@/layouts/", "^type:@/layouts/"],
          // @/pages and its types
          ["^@/pages/", "^type:@/pages/"],
          // @/routes and its types
          ["^@/routes/", "^type:@/routes/"],
          // @/services and its types
          ["^@/services/", "^type:@/services/"],
          // @/utils and its types
          ["^@/utils/", "^type:@/utils/"],
          // @/types (shared types)
          ["^@/types/"],
          // Other internal aliases
          ["^@/"],
          // Relative imports
          ["^\\.", "^type:\\."],
        ],
      },
    ],
    "simple-import-sort/exports": "error",

    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-wrapper-object-types": "off",
    "no-empty": [
      "error",
      {
        allowEmptyCatch: true,
      },
    ],

    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        trailingComma: "all",
        printWidth: 120,
        tabWidth: 2,
        endOfLine: "auto",
      },
    ],
  },
};
