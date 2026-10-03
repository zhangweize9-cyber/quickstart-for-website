/**
 * @file eslint.config.ts
 * @see {
 *   @link https://eslint.org/docs/latest/use/configure/configuration-files
 *   @link https://typescript-eslint.io/getting-started/typed-linting
 * }
 */

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["src/**/*.{ts, tsx}", "node_modules/.pnpm_patches/**/*.{ts, tsx}"],
    ignores: ["**/*.config.js", "!**/eslint.config.js"],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
