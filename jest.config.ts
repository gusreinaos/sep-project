import type { Config } from 'jest';

const config: Config = {
  roots: ["<rootDir>/tests"], // Ensure your test files are under this path
  testMatch: ["**/*.test.ts", "**/*.spec.ts"], // Ensure TypeScript test files are included
  transform: {
    "^.+\\.tsx?$": "ts-jest" // If you're using TypeScript
  },
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
};

export default config;