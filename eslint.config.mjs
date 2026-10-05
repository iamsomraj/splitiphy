import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettierRecommended,
  globalIgnores(['.next/**', 'node_modules/**', 'drizzle/**', 'next-env.d.ts']),
]);
