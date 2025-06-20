module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{js,ts}", "!src/types/**/*"],
  moduleDirectories: ["node_modules", "src"],
};
