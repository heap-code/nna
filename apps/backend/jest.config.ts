import * as swc from "@swc/core";
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
			"@swc/jest",
			{
				jsc: {
					externalHelpers: true,
					keepClassNames: true,
					loose: true,
					parser: {
						decorators: true,
						dynamicImport: true,
						syntax: "typescript",
					},
					target: "es2021",
					transform: {
						decoratorMetadata: true,
						legacyDecorator: true,
					},
				},
				module: { type: "commonjs" },
				sourceMaps: "inline",
			} satisfies swc.Options,
		],
	},
} satisfies JestConfigWithTsJest;
