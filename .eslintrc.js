module.exports = {
  root: true,
  env: { browser: true, node: true, es2021: true, jest: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: false }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/strict-boolean-expressions': 'error',
    'no-console': [
      'error',
      { allow: ['log', 'warn', 'error'] }
    ],
    'eqeqeq': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-implicit-coercion': 'error',
    'no-duplicate-imports': 'error',
    'no-undef': 'error',
    'no-empty-function': 'error',
    'no-async-promise-executor': 'error',
    'no-constant-condition': 'error',
    'no-extra-boolean-cast': 'error',
    'no-template-curly-in-string': 'error',
    'no-unreachable': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',

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
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname
      }
    }
  ]
};
