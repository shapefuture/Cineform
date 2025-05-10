/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/packages', '<rootDir>/apps'],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleNameMapper: {
    '^@cineform-forge/shared-types(.*): '<rootDir>/packages/shared-types/src$1',
    '^@cineform-forge/engine(.*): '<rootDir>/packages/engine/src$1',
    '^@cineform-forge/ai-assistant(.*): '<rootDir>/packages/ai-assistant/src$1',
    '^@cineform-forge/templates-library(.*): '<rootDir>/packages/templates-library/src$1',
    '\\.(css|less|scss|sass): 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/?(*.)+(spec|test).(ts|tsx|js)'
  ]
};