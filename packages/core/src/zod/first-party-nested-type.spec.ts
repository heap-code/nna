import * as z from "zod";

import {
	ExploreZodSchemaFirstPartyNestedResultFound,
	ZodAnyFirstPartySchemaTypeName,
	findZodSchemaFirstPartyNested,
	isZodSchemaFirstPartyNestedType,
} from "./first-party-nested-type";

describe("ZodSchemaFirstPartyNestedType", () => {
	describe("findZodSchemaFirstPartyNested", () => {
		it("should not found types", () => {
			expect(
				findZodSchemaFirstPartyNested(z.date(), () => false).found,
			).toBe(false);
		});

		it("should explore and return correctly on first level", () => {
			for (const schema of [z.number(), z.string()]) {
				const result = findZodSchemaFirstPartyNested(
					schema,
					({ _def }) => _def.typeName === schema._def.typeName,
				) as ExploreZodSchemaFirstPartyNestedResultFound<
					typeof schema,
					typeof schema
				>;

				expect(result.found).toBe(true);
				expect(result.schema).toBe(schema);
				expect(result.replace(schema)).toBe(schema);
			}
		});

		it("should explore and be able to replace", () => {
			for (const schema of [z.date(), z.enum(["a", "b"])]) {
				const _result = findZodSchemaFirstPartyNested(
					schema.nullable().optional().readonly(),
					({ _def }) => _def.typeName === schema._def.typeName,
				);

				const result = _result as Extract<
					typeof _result,
					{ found: true }
				>;
				expect(result.found).toBe(true);
				expect(result.schema).toBe(schema);
				// Stringify to the same
				expect(JSON.stringify(result.replace(z.number()))).toBe(
					JSON.stringify(z.number().nullable().optional().readonly()),
				);
			}
		});
	});

	it("should determine type", () => {
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
