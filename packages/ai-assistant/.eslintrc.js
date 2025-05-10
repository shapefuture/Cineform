module.exports = {
  root: true,
  env: { node: true, es2021: true, jest: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    // Strict type safety: no any, explicit return, strict boolean expressions
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: false }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/strict-boolean-expressions': 'error',

    // No accidental console, except for logging as required for debug/diagnostic traces
    'no-console': [
      'error',
      { allow: ['log', 'warn', 'error'] }
    ],

    // Basic strictness and hygiene
    'eqeqeq': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-implicit-coercion': 'error',
    'no-duplicate-imports': 'error',
    'no-undef': 'error',

    // Jest
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
      }
    }
  ]
};