import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  // Ignore patterns (replaces .eslintignore)
  {
    ignores: ['coverage/**', 'dist/**', 'node_modules/**', 'eslint.config.js'],
  },
  // Base JavaScript recommended rules
  eslint.configs.recommended,
  // TypeScript recommended rules with type checking
  ...tseslint.configs.recommendedTypeChecked,
  {
    // TypeScript configuration for type checking
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    // Override rules specifically for test files
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
);
