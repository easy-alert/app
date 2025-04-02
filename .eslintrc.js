// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },

  ignorePatterns: ["/dist/*"],

  extends: [
    "expo",
    "eslint:recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "prettier"],

  rules: {
    camelcase: 2,

    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "import/prefer-default-export": "off",
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "import/no-cycle": "off",
    "import/order": [
      "error",
      {
        "newlines-between": "always-and-inside-groups",

        groups: [["builtin", "external"], "internal", "sibling", "parent", "index", "type"],

        pathGroups: [
          {
            pattern: "@(react|react-native)",
            group: "external",
            position: "before",
          },
          {
            pattern: "@(components|pages|routes|hooks|utils|types|services|assets|styles|context|theme)/**",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["react", "internal", "type"],
      },
    ],

    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-wrapper-object-types": "off",

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
