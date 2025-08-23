import * as z from "zod";

import { Filter } from "./filter";
import { filter as schema } from "./filter.schema";

const schemaFlat = z.object({
	boolean: z.boolean().readonly(),
	booleanNullable: z.boolean().nullable(),
	date: z.date(),
	dateNullable: z.date().nullable(),
	number: z.number(),
	numberNullable: z.number().nullable().readonly(),
	string: z.string(),
	stringNullable: z.string().nullable(),
});
type SchemaFlat = z.infer<typeof schemaFlat>;

describe("Filter schema", () => {
	describe("With flat objects", () => {
		const filterSchema = schema(schemaFlat);

		it("should be valid", () => {
			const filters: Array<Filter<SchemaFlat>> = [
				{
					boolean: true,
					booleanNullable: false,
					date: new Date(),
					dateNullable: new Date(),
					number: 1,
					numberNullable: 2,
					string: "abc",
					stringNullable: "def",
				},
				{
					booleanNullable: null,
					dateNullable: null,
					numberNullable: null,
					stringNullable: null,
				},
				{
					boolean: true,
					number: { $gt: 2, $lt: 10 },
					stringNullable: { $eq: null },
				},
				{
					$and: [
						{ number: { $gt: 10 } },
						{ dateNullable: null, number: { $lt: 100 } },
					],
					stringNullable: null,
				},
				{
					$or: [
						{ number: { $gte: 10, $lte: 20 } },
						{ numberNullable: { $ne: null } },
					],
					boolean: false,
				},
				{
					$not: { number: { $gte: 10, $lte: 20 } },
					boolean: true,
				},
				{
					$and: [{ string: { $gt: "a" } }, { number: { $lt: 2 } }],
					$or: [
						{ $and: [{ number: 1 }, { number: 2 }] },
						{ $not: { boolean: { $exists: true } } },
					],
					string: { $ne: "" },
				},
				{},
			];

			for (const filter of filters) {
				const results = filterSchema.safeParse(filter);
				expect(results.success).toBe(true);
				expect(results.data).toStrictEqual(filter);
			}
		});

		it("should not be valid", () => {
			const filters: Array<[Filter<SchemaFlat>, number]> = [
				[
					{
						boolean: "true" as unknown as boolean,
						booleanNullable: "false" as unknown as boolean,
						date: "new Date()" as unknown as Date,
						dateNullable: "new Date()" as unknown as Date,
						number: "1" as unknown as number,
						numberNullable: "2" as unknown as number,
						string: 1 as unknown as string,
						stringNullable: 2 as unknown as string,
					},
					8,
				],
				[
					{
						boolean: null as unknown as boolean,
						date: null as unknown as Date,
						number: null as unknown as number,
						string: null as unknown as string,
					},
					4,
				],
				[
					{
						$and: [
							{ string: "" },
							{ string: 123 as unknown as string },
						],
						$not: { boolean: null as unknown as boolean },
						$or: [
							{ string: "" },
							{ string: 123 as unknown as string },
						],
						date: { $eq: "" as unknown as Date },
					},
					4,
				],
			];

			for (const [filter, nError] of filters) {
				const result = filterSchema.safeParse(filter);

				expect(result.success).toBe(false);
				expect(result.error?.issues).toHaveLength(nError);
			}
		});
	});

	describe("With nested objects", () => {
		const schemaNested = z.object({
			child: schemaFlat,
			children: z.array(schemaFlat),
			nest: z.object({ child: schemaFlat }),
		});
		type SchemaNested = z.infer<typeof schemaNested>;

		const filterSchema = schema(schemaNested);

		it("should be valid", () => {
			const filters: Array<Filter<SchemaNested>> = [
				{
					$or: [
						{ nest: { child: { number: 0 } } },
						{ child: { number: 0 } },
					],
					child: { boolean: { $eq: true } },
				},
				{
					$not: { $or: [{ child: { number: 0 } }] },
					children: { number: { $gt: 0, $lt: 10 } },
				},
			];

			for (const filter of filters) {
				expect(filterSchema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: Array<[Filter<SchemaNested>, number]> = [
				[{ child: { string: { $ne: 1 as unknown as string } } }, 1],
				[{ nest: { child: { string: 1 as unknown as string } } }, 1],
				[{ $and: [{ child: { string: 1 as unknown as string } }] }, 1],
				[
					{
						children: [
							{
								string: 1 as unknown as string,
							} satisfies Filter<SchemaNested>["children"],
						] as never,
					},
					1,
				],
			];

			for (const [filter, nError] of filters) {
				const result = filterSchema.safeParse(filter);

				expect(result.success).toBe(false);
				expect(result.error?.issues).toHaveLength(nError);
			}
		});
	});

	describe("With discriminated union", () => {
		const schemaDiscriminated = z.discriminatedUnion("type", [
			z.object({ date: z.date().nullable(), type: z.literal("idle") }),
			z.object({ data: z.string(), type: z.literal("success") }),
			z.object({ code: z.number(), type: z.literal("error") }),
		]);

		const schemaWithDiscrimination = z.object({
			child: z.object({
				discriminated: schemaDiscriminated,
				number: z.number(),
			}),
			discriminated: schemaDiscriminated,
		});
		type SchemaWithDiscrimination = z.infer<
			typeof schemaWithDiscrimination
		>;

		const filterSchema = schema(schemaWithDiscrimination, {
			strict: true,
		});

		it("should be valid", () => {
			const filters: Array<Filter<SchemaWithDiscrimination>> = [
				{ discriminated: { type: "idle" } },
				{
					$and: [
						{
							discriminated: {
								data: { $in: ["abc", "def"] },
								type: "success",
							},
						},
						{
							discriminated: {
								code: { $gte: 400 },
								type: "error",
							},
						},
					],
				},
			];

			for (const filter of filters) {
				expect(filterSchema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: Array<[Filter<SchemaWithDiscrimination>, number]> = [
				[
					{
						$or: [
							{
								discriminated: {
									data: { $in: ["abc", "def"] },
									type: "success",
								},
							},
							{
								discriminated: {
									code: { $gte: "400" as unknown as number },
									type: "error",
								},
							},
						],
					},
					1,
				],
				[
					{
						$or: [
							{
								discriminated: {
									data: { $in: ["abc", "def"] },
									type: "success",
								},
							},
							{
								// @ts-expect-error -- `code` is only valid for `error` type
								discriminated: { code: { $gte: 400 } },
							},
						],
					},
					1,
				],
			];

			for (const [filter, nError] of filters.slice(0, 1)) {
				const result = filterSchema.safeParse(filter);

				expect(result.success).toBe(false);
				expect(result.error?.issues).toHaveLength(nError);
			}
		});

		describe("With coerce", () => {
			const filterSchema = schema(schemaWithDiscrimination, {
				coerce: true,
				strict: true,
			});

			it("should be valid", () => {
				const tests: Array<
					[
						Filter<SchemaWithDiscrimination>,
						Filter<SchemaWithDiscrimination>,
					]
				> = [
					[
						{ child: { number: "1" as unknown as number } },
						{ child: { number: 1 } },
					],
					[
						{
							$not: {
								$not: {
									discriminated: {
										code: {
											$gt: "400" as unknown as number,
										},
										type: "error",
									},
								},
							},
						},
						{
							$not: {
								$not: {
									discriminated: {
										code: { $gt: 400 },
										type: "error",
									},
								},
							},
						},
					],
				];

				for (const [filter, expected] of tests) {
					const results = filterSchema.safeParse(filter);
					expect(results.success).toBe(true);
					expect(results.data).toStrictEqual(expected);
				}
			});
		});
	});

	describe("With lazy content", () => {
		const schemaLoop = schemaFlat.extend({
			lazyNumber: z.lazy(() => z.number()),
			get lazyObject() {
				return z.lazy(() => schemaLoop);
			},
			get lazyObject2() {
				return z.lazy(() => schemaLoop);
			},
		});

		type SchemaWithLazy = z.infer<typeof schemaLoop>;
		const filterSchema = schema(schemaLoop, { strict: true });

		it("should be valid", () => {
			const orders: Array<Filter<SchemaWithLazy>> = [
				{ boolean: true, lazyNumber: { $gt: 2 } },
				{ lazyObject: { date: new Date(), string: "" } },
				{ lazyObject: { lazyNumber: { $ne: 0 } } },
				{ lazyObject: { lazyObject: {} } },
				{
					lazyObject: {
						lazyObject: {
							lazyNumber: { $in: [1] },
							lazyObject: { lazyNumber: 0 },
						},
					},
				},
			];

			for (const order of orders) {
				expect(filterSchema.parse(order)).toStrictEqual(order);
			}
		});

		it("should not be valid", () => {
			// @ts-expect-error -- desired to be a wrong value
			const invalidValue: number = "__";
			const orders: Array<[Filter<SchemaWithLazy>, number]> = [
				[{ lazyNumber: invalidValue }, 1],
				[
					{
						lazyObject: {
							lazyNumber: invalidValue,
							number: { $ne: invalidValue },
						},
					},
					2,
				],
				[{ lazyObject: { lazyObject: { lazyObject: 1 as never } } }, 1],
				[
					{
						lazyObject: {
							lazyObject: {
								lazyNumber: { $in: [invalidValue] },
								number: invalidValue,
							},
						},
					},
					2,
				],
			];

			for (const [order, nError] of orders) {
				const result = filterSchema.safeParse(order);

				expect(result.success).toBe(false);
				expect(result.error?.issues).toHaveLength(nError);
			}
		});
	});
});
