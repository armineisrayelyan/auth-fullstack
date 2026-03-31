module.exports = {
    reporters: [
        "default",
        [
            "jest-html-reporters",
            {
                "publicPath": "./html-report",
                "filename": "report.html"
            }
        ]
    ],
    testEnvironment: 'node',
    setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.js"],
    testTimeout: 30000,
};