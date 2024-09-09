import type * as swc from "@swc/core";
import * as fs from "fs";
import type { JestConfigWithTsJest } from "ts-jest";

const swcConfig = JSON.parse(
	fs.readFileSync(`${__dirname}/.swcrc.json`, "utf-8"),
) as swc.Options;

const swcJestConfig = {
	...swcConfig,

	// Reading the SWC compilation config and remove the "exclude"
	// for the test files to be compiled by SWC
	exclude: [],
	// disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves.
	// If we do not disable this, SWC Core will read .swcrc and won't transform our test files due to "exclude"
	swcrc: false,
} satisfies swc.Options;

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
		"^.+\\.[tj]s$": ["@swc/jest", swcJestConfig],
	},
} satisfies JestConfigWithTsJest;
