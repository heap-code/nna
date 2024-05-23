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

	describe("With lazy content", () => {
		const groupSchemaBase = z.object({ name: z.string() });
		const userSchemaBase = z.object({ gId: z.number(), user: z.string() });

		interface Group extends z.infer<typeof groupSchemaBase> {
			users: User[];
		}
		interface User extends z.infer<typeof userSchemaBase> {
			group: Group;
		}

		// TODO: transform this to a type-helper (and make it better, e.g. with optional)
		type SchemaCircularItself = "__zod_circular_";
		type SchemaCircular<
			Base extends z.AnyZodObject,
			Out extends object = z.infer<Base>,
		> = z.ZodObject<
			z.objectUtil.extendShape<
				Base["shape"],
				{
					[K in keyof Out]: z.ZodType<
						Out[K] extends SchemaCircularItself
							? z.infer<SchemaCircular<Base, Out>>
							: Out[K]
					>;
				}
			>,
			Base["_def"]["unknownKeys"],
			Base["_def"]["catchall"],
			Base["_output"] & {
				[K in keyof Out]: Out[K] extends SchemaCircularItself
					? z.infer<SchemaCircular<Base, Out>>
					: Out[K];
			}
		>;

		const groupSchema: SchemaCircular<
			typeof groupSchemaBase,
			{ users: User[] }
		> = groupSchemaBase.extend({
			users: z.array(z.lazy(() => userSchema())),
		});
		/** @internal */
		function userSchema() {
			return userSchemaBase.extend({ group: groupSchema });
		}

		const filterSchema = createQueryObjectSchema(groupSchema, {
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
				const result = filterSchema.safeParse(
					filter,
				) as z.SafeParseError<never>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});
	});
});
