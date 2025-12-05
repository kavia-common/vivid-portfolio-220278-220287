'use strict';

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupEnv.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  verbose: false,
};
