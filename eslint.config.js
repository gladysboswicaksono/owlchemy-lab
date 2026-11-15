// ESLint reads the code and reports mistakes before a learner meets them.
// Run it with: npm run lint
import js from '@eslint/js';
import globals from 'globals';
import a11y from 'eslint-plugin-jsx-a11y';

export default [
  // Folders that hold generated or downloaded files, not our own code.
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Component names start with a capital letter and are used inside JSX,
      // which this rule cannot see. Skip them so it does not report them.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Accessibility checks for the components and the page layout.
    files: ['src/**/*.jsx'],
    plugins: { 'jsx-a11y': a11y },
    rules: {
      ...a11y.configs.recommended.rules,
      // A code sample can scroll sideways, so keyboard users must be able to
      // focus it. That is why <pre> is allowed a tab stop.
      'jsx-a11y/no-noninteractive-tabindex': ['error', { tags: ['pre'] }],
    },
  },
];
