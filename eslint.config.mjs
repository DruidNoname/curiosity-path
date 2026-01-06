import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default defineConfig([
  // Next.js конфиги
  ...compat.extends("next/core-web-vitals"),

  // TypeScript
  ...compat.extends(
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ),

  // React
  ...compat.extends(
      "plugin:react/recommended",
      "plugin:react-hooks/recommended"
  ),

  // TanStack Query
  ...compat.extends(
      "@tanstack/eslint-plugin-query/recommended"
  ),

  // Правила
  {
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],

      // React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Импорты
      "no-restricted-imports": [
        "error",
        {
          "patterns": ["@mui/*/*/*", "src/*"]
        }
      ],
    },
  },
]);