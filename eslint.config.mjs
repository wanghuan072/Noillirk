import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    files: ["app/**/*.tsx", "components/**/*.tsx"],
    rules: {
      // Global project navigation requires full document loads and reliable iframe cleanup.
      "@next/next/no-html-link-for-pages": "off",
      // All adopted images are local, sized and preprocessed; exact asset identity is audited.
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-preview/**",
    ".next-dev/**",
    ".npm-cache/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
