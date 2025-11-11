import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // 假设这是包含 TypeScript 解析器的配置对象
    // 如果没有，你需要确保你的配置中有 '@typescript-eslint/parser'
    // 并在 files 字段中指定 .ts, .tsx 文件
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // 1. 设置为 'off' (0) 完全禁用该规则
      "@typescript-eslint/no-explicit-any": "off",

      // 2. 或者设置为 'warn' (1) 只给出警告而不是错误
      // "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
