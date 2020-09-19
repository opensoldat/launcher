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
    "transform": {
        "\\.(ts|tsx)$": "ts-jest"
    }
}