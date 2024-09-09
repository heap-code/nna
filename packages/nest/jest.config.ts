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

// Uncomment if using global setup/teardown files being transformed via swc
// https://nx.dev/packages/jest/documents/overview#global-setup/teardown-with-nx-libraries
// jest needs EsModule Interop to find the default exported setup/teardown functions
// swcJestConfig.module.noInterop = false;

export default {
	displayName: "nest",
	moduleFileExtensions: ["ts", "js", "html"],
	preset: "../../jest.preset.js",
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]s$": ["@swc/jest", swcJestConfig],
	},
} satisfies JestConfigWithTsJest;
