import reactConfig from '@acme/linting/react';
import baseConfig from '@acme/linting/base';

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: ['.expo/**', 'expo-plugins/**', 'scripts/**', 'android/**', 'ios/**'],
  },
  ...baseConfig,
  ...reactConfig,
];
