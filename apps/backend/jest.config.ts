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
	globals: {
		"handlebars-jest": {
			partialDirs: ["<rootDir>/src/app/mail/mails/templates"],
		},
	},
	moduleFileExtensions: ["ts", "js", "html"],
	preset: "../../jest.preset.js",
	testEnvironment: "node",
	transform: {
		"^.+\\.(handlebars|hbs)$": "handlebars-jest",
		"^.+\\.[tj]s$": [
			"ts-jest",
			{ tsconfig: "<rootDir>/tsconfig.spec.json" },
		],
	},
} satisfies JestConfigWithTsJest;
