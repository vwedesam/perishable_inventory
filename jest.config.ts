
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: ".spec.ts$",
  coverageDirectory: "../coverage",
  rootDir: "./src",
  setupFiles: [
    "../jest-setup-file.ts"
  ],
};
