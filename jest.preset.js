const nxPreset = require("@nx/jest/preset").default;

/** @type {import("jest").Config} */
module.exports = {
	...nxPreset,
	collectCoverageFrom: [
		"<rootDir>/src/**/*.ts",
		"!<rootDir>/src/**/index.ts",
	],
	coverageReporters: ["html", "json-summary", "text"],
	coverageThreshold: { global: {} },
	testPathIgnorePatterns: ["<rootDir>/e2e"],
	watchPlugins: [
		"jest-watch-typeahead/filename",
		"jest-watch-typeahead/testname",
	],
};
