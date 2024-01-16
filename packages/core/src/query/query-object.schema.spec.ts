import * as z from "zod";

import { QueryOrderValue } from ".";
import { QueryObject } from "./query-object";
import { createQueryObjectSchema } from "./query-object.schema";

const schemaData = z.object({
	number: z.number().nullable(),
	object: z.object({ bool: z.boolean(), kind: z.enum(["a", "b", "c"]) }),
	string: z.string(),
});
type SchemaData = z.infer<typeof schemaData>;
type SchemaQuery = QueryObject<SchemaData>;

describe("QueryObject Schema", () => {
	const querySchema = createQueryObjectSchema(schemaData, { strict: true });

	it("should be valid", () => {
		const tests: SchemaQuery[] = [
			{ limit: 1, skip: 1 },
			{
				limit: 0,
				order: [{ number: "asc" }, { object: { bool: "desc" } }],
			},
			{
				filter: { $or: [{ number: 1 }, { string: { $ne: "a" } }] },
				limit: 0,
			},
		];

		for (const options of tests) {
			expect(querySchema.safeParse(options).success).toBe(true);
		}
	});

	it("should not be valid", () => {
		const tests: Array<[SchemaQuery, number]> = [
			[{ limit: -2, skip: -1 }, 2],
			[
				{
					order: [
						{},
						{ number: "abc" as unknown as QueryOrderValue },
					],
					skip: 0,
				},
				1,
			],
			[{ filter: { number: "a" as unknown as number } }, 1],
		];

		for (const [options, nError] of tests) {
			const result = querySchema.safeParse(
				options,
			) as z.SafeParseError<never>;

			expect(result.success).toBe(false);
			expect(result.error.errors).toHaveLength(nError);
		}
	});

	it("should remove extraneous values (non-strict)", () => {
		const querySchema = createQueryObjectSchema(schemaData);

		const tests: SchemaQuery[] = [
			{ filter: {}, order: [] },
			{ limit: 0, skip: 0 },
		];

		for (const options of tests) {
			const results = querySchema.safeParse({
				...options,
				a: "abc",
			}) as z.SafeParseSuccess<never>;

			expect(results.success).toBe(true);
			expect(results.data).toStrictEqual(options);
		}
	});
});
