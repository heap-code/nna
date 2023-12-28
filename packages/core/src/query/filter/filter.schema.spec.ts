import { z } from "zod";

import { Filter } from "./filter";
import { createFilterSchema } from "./filter.schema";

const schemaFlat = z.object({
	boolean: z.boolean(),
	booleanNullable: z.boolean().nullable(),
	date: z.date(),
	dateNullable: z.date().nullable(),
	number: z.number(),
	numberNullable: z.number().nullable(),
	string: z.string(),
	stringNullable: z.string().nullable(),
});
type SchemaFlat = z.infer<typeof schemaFlat>;

describe("QueryFilter", () => {
	describe("With flat objects", () => {
		const filterSchema = createFilterSchema(schemaFlat);

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
				expect(filterSchema.safeParse(filter).success).toBe(true);
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
				const result = filterSchema.safeParse(
					filter,
				) as z.SafeParseError<Filter<SchemaFlat>>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
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

		const filterSchema = createFilterSchema(schemaNested);

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
				const result = filterSchema.safeParse(
					filter,
				) as z.SafeParseError<Filter<SchemaNested>>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});
	});

	describe("With discriminated union", () => {});
});
