import * as z from "zod";

import { QueryOrderValue } from ".";
import { QUERY_OPTIONS_DEFAULT_LIMIT } from "./options";
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
			const result = querySchema.safeParse(options);

			expect(result.success).toBe(false);
			expect(result.error?.issues).toHaveLength(nError);
		}
	});

	it("should be valid with coercion", () => {
		const limit = 10;
		const querySchema = createQueryObjectSchema(schemaData, {
			coerce: true,
			defaultLimit: limit,
			strict: true,
		});
		type Schema = z.infer<typeof querySchema>;

		for (const [test, expected] of [
			[{ limit: "2" as never as number }, { limit: 2 }],
			[{ skip: "55" as never as number }, { skip: 55 }],
		] satisfies Array<[Schema, Schema]>) {
			expect(querySchema.parse(test)).toStrictEqual({
				limit,
				...(expected as Schema),
			} satisfies Schema);
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
			});

			expect(results.success).toBe(true);
			expect(results.data).toStrictEqual({
				limit: QUERY_OPTIONS_DEFAULT_LIMIT,
				...options,
			} satisfies SchemaQuery);
		}
	});

	describe("With lazy content", () => {
		const groupSchema = z.object({
			name: z.string(),
			get users() {
				// eslint-disable-next-line @typescript-eslint/no-use-before-define -- Ok here
				return userSchema;
			},
		});
		const userSchema = z.object({
			gId: z.number(),
			get group() {
				return groupSchema;
			},
			user: z.string(),
		});

		const filterSchema = createQueryObjectSchema(groupSchema, {
			defaultLimit: null,
			strict: true,
		});
		type FilterGroup = z.infer<typeof filterSchema>;

		it("should be valid", () => {
			const filters: FilterGroup[] = [
				{ filter: { name: "w", users: { gId: 3 } }, skip: 1 },
				{ limit: 1, order: [{ name: "asc", users: { gId: "desc" } }] },
				{
					filter: {
						$not: {
							users: {
								group: { name: { $ne: "abc" } },
								user: { $nin: ["a", "b"] },
							},
						},
					},
					order: [
						{ users: { group: { users: { user: "asc" } } } },
						{ name: "asc", users: { group: {} } },
					],
				},
			];

			for (const filter of filters) {
				expect(filterSchema.parse(filter)).toStrictEqual(filter);
			}
		});

		it("should not be valid", () => {
			const tests: Array<[FilterGroup, number]> = [
				[{ filter: { users: { gId: "123" as never as number } } }, 1],
				[
					{
						limit: "1" as never as number,
						order: [{ users: { gId: 123 as never } }],
					},
					2,
				],
				[
					{
						filter: {
							$not: {
								users: {
									group: { name: { $ne: 123 as never } },
									user: { $nin: "a" as never },
								},
							},
						},
						order: [
							{ users: { group: { users: "asc" as never } } },
							{
								name: "asc",
								// @ts-expect-error -- undesired key
								users: { group: { _unknown: "asc" } },
							},
						],
					},
					4,
				],
			];

			for (const [filter, nError] of tests) {
				const result = filterSchema.safeParse(filter);

				expect(result.success).toBe(false);
				expect(result.error?.issues).toHaveLength(nError);
			}
		});
	});
});
