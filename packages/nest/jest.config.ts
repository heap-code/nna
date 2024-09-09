import * as swc from "@swc/core";
import { JestConfigWithTsJest } from "ts-jest";

export default {
	displayName: "nest",
	moduleFileExtensions: ["ts", "js", "html"],
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
