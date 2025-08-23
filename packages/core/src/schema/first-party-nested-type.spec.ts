import * as z from "zod";

import {
	AnyFirstPartySchemaTypeName,
	findSchemaFirstPartyNested,
	isSchemaFirstPartyNestedType,
} from "./first-party-nested-type";

describe("SchemaFirstPartyNestedType", () => {
	describe("findSchemaFirstPartyNested", () => {
		it("should not found types", () => {
			expect(
				findSchemaFirstPartyNested(z.date(), () => false).found,
			).toBe(false);
		});

		it("should explore and return correctly on first level", () => {
			for (const schema of [z.number(), z.string()]) {
				const result = findSchemaFirstPartyNested(
					schema,
					({ _zod }) => _zod.def.type === schema._zod.def.type,
				);

				expect(result.found).toBe(true);

				const okResult = result as Extract<
					typeof result,
					{ found: true }
				>;
				expect(okResult.schema).toBe(schema);
				expect(okResult.replace(schema)).toBe(schema);
			}
		});

		it("should explore and be able to replace", () => {
			for (const schema of [z.date(), z.enum(["a", "b"])]) {
				const _result = findSchemaFirstPartyNested(
					schema.nullable().optional().readonly(),
					({ _zod }) => _zod.def.type === schema._zod.def.type,
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
			[z.ZodType, AnyFirstPartySchemaTypeName[], boolean]
		> = [
			[z.string(), ["string"], true],
			[z.object({}), ["string"], false],
			[z.number(), ["number", "string"], true],
			[z.string(), ["number", "date"], false],
		];

		for (const [schema, types, expected] of tests) {
			expect(isSchemaFirstPartyNestedType(schema, types)).toBe(expected);
		}
	});
});
