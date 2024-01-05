import { JestConfigWithTsJest } from "ts-jest";

export default {
	coverageDirectory: "../../dist/coverage/apps/backend",
	displayName: "backend",
	moduleFileExtensions: ["ts", "js", "html"],
	preset: "../../jest.preset.js",
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]s$": [
			"ts-jest",
			{ tsconfig: "<rootDir>/tsconfig.spec.json" },
		],
	},
} satisfies JestConfigWithTsJest;
