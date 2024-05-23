import { JestConfigWithTsJest } from "ts-jest";

export default {
	coveragePathIgnorePatterns: [
		"src/configuration/environments.*.ts",
		"src/environment.ts",
	],
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
