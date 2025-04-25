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

    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",

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
