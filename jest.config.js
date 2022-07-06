module.exports = {
    "moduleNameMapper": {
        "\\.css$": "<rootDir>/src/tests/styleMock.js"
    },
    "modulePaths": [
        "<rootDir>"
    ],
    "roots": [
        "<rootDir>/src"
    ],
    "setupFilesAfterEnv": [
        "<rootDir>/src/tests/setup.ts"
    ],
    "testEnvironment": "jsdom",
    "transform": {
        "\\.(ts|tsx)$": "ts-jest"
    }
}