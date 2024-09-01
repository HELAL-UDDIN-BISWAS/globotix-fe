module.exports = {
	transform: {
		"^.+\\.(js|jsx)$": "babel-jest",
	},
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["@testing-library/jest-dom"],
	moduleNameMapper: {
		"^@/components/(.*)$": "<rootDir>/src/components/$1",
		"^next/font/(.*)$": "<rootDir>/__mocks__/next/font/$1",
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	setupFiles: ["<rootDir>/jest.setup.js"],
};
