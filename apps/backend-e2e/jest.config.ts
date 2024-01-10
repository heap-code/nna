import { JestConfigWithTsJest } from "ts-jest";

export default {
	coverageDirectory: "../../dist/coverage/backend-e2e",
	displayName: "backend-e2e",
	globalSetup: "<rootDir>/src/support/global/setup.ts",
	globalTeardown: "<rootDir>/src/support/global/teardown.ts",
	moduleFileExtensions: ["ts", "js", "html"],
	preset: "../../jest.preset.js",
	setupFiles: ["<rootDir>/src/support/test-setup.ts"],
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]s$": [
			"ts-jest",
			{
				tsconfig: "<rootDir>/tsconfig.spec.json",
			},
		],
	},
} satisfies JestConfigWithTsJest;
