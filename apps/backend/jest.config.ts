import { JestConfigWithTsJest } from "ts-jest";

export default {
	coveragePathIgnorePatterns: [
		"src/configuration/environments.*.ts",
		"src/environment.ts",
		"src/main.ts",
		"src/main.e2e.ts",
		"src/orm/migrations",
		"src/orm/seeders",
	],
	displayName: "backend",
	moduleFileExtensions: ["ts", "js", "html"],
	moduleNameMapper: {
		"^.+\\.(handlebars|hbs)$": "<rootDir>/test/handlebars.mock.js",
	},
	preset: "../../jest.preset.js",
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]s$": [
			"ts-jest",
			{ tsconfig: "<rootDir>/tsconfig.spec.json" },
		],
	},
} satisfies JestConfigWithTsJest;
