import * as z from "zod";

import type { QueryOrderValue } from "..";
import { Options } from "./options";
import { options as createSchema } from "./options.schema";

const schemaData = z.object({
	number: z.number().nullable(),
	object: z.object({ bool: z.boolean(), kind: z.enum(["a", "b", "c"]) }),
	string: z.string(),
});
type SchemaData = z.infer<typeof schemaData>;
type SchemaOptions = Options<SchemaData>;

describe("QueryOptions schema", () => {
	const optionsSchema = createSchema(schemaData, { strict: true });

	it("should be valid", () => {
		const tests: SchemaOptions[] = [
			{ limit: 1, skip: 1 },
			{ order: [], skip: 1000 },
			{
				limit: 0,
				order: [{ number: "asc" }, { object: { bool: "desc" } }],
			},
		];

		for (const options of tests) {
			expect(optionsSchema.safeParse(options).success).toBe(true);
		}
	});

	it("should not be valid", () => {
		const tests: Array<[SchemaOptions, number]> = [
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
			[{ order: {} as unknown as never }, 1],
		];

		for (const [options, nError] of tests) {
			const result = optionsSchema.safeParse(options);

			expect(result.success).toBe(false);
			expect(result.error?.issues).toHaveLength(nError);
		}
	});

	it("should remove extraneous values (non-strict)", () => {
		const optionsSchema = createSchema(schemaData);

		const tests: SchemaOptions[] = [
			{ limit: 1, order: [] },
			{ limit: 0, skip: 100 },
		];

		for (const options of tests) {
			const results = optionsSchema.safeParse({
				...options,
				a: "abc",
			});

			expect(results.success).toBe(true);
			expect(results.data).toStrictEqual(options);
		}
	});
});
