import * as z from "zod";

import {
	ZodAnyFirstPartySchemaTypeName,
	isZodSchemaFirstPartyNestedType,
} from "./is-first-party-nested-type";

describe("isZodSchemaFirstPartyNestedType", () => {
	it("isZodSchemaFirstPartyNestedType", () => {
		const tests: Array<
			[z.ZodTypeAny, ZodAnyFirstPartySchemaTypeName[], boolean]
		> = [
			[z.string(), [z.ZodFirstPartyTypeKind.ZodString], true],
			[z.object({}), [z.ZodFirstPartyTypeKind.ZodString], false],
			[
				z.number(),
				[
					z.ZodFirstPartyTypeKind.ZodNumber,
					z.ZodFirstPartyTypeKind.ZodString,
				],
				true,
			],
			[
				z.string(),
				[
					z.ZodFirstPartyTypeKind.ZodNumber,
					z.ZodFirstPartyTypeKind.ZodDate,
				],
				false,
			],
		];

		for (const [schema, types, expected] of tests) {
			expect(isZodSchemaFirstPartyNestedType(schema, types)).toBe(
				expected,
			);
		}
	});
});
