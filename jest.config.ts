import { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config = createJestConfig({
  displayName: '@your-org/project-name',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/playwright/'],
  testMatch: ['**/*/(test|spec).(ts|tsx|js|jsx)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: 'test-output/jest/coverage',
});

// eslint-disable-next-line import/no-anonymous-default-export
export default async () =>
  ({
    ...(await config()),
    coverageProvider: 'v8',
    verbose: process.env.CI ? false : true,
  } as Config);