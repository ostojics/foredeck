import reactConfig from '@acme/linting/react';
import baseConfig from '@acme/linting/base';

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: ['dist/**/*', 'public/mockServiceWorker.js'],
  },
  ...baseConfig,
  ...reactConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
  },
];
