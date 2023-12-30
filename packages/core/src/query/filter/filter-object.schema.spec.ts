import { z } from "zod";

import { FilterObject } from "./filter-object";
import { createFilterObjectSchema } from "./filter-object.schema";

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

describe("QueryObjectFilter schema", () => {
	describe("With flat objects", () => {
		const filterSchema = createFilterObjectSchema(schemaFlat);

		it("should be valid", () => {
			const filters: Array<FilterObject<SchemaFlat>> = [
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
				{},
			];

			for (const filter of filters) {
				expect(filterSchema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: Array<[FilterObject<SchemaFlat>, number]> = [
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
			];

			for (const [filter, nError] of filters) {
				const result = filterSchema.safeParse(
					filter,
				) as z.SafeParseError<FilterObject<SchemaFlat>>;

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

		const filterSchema = createFilterObjectSchema(schemaNested);

		it("should be valid", () => {
			const filters: Array<FilterObject<SchemaNested>> = [
				{ child: { boolean: { $eq: true } } },
				{ children: { number: { $gt: 0, $lt: 10 } } },
			];

			for (const filter of filters) {
				expect(filterSchema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: Array<[FilterObject<SchemaNested>, number]> = [
				[{ child: { string: { $ne: 1 as unknown as string } } }, 1],
				[{ nest: { child: { string: 1 as unknown as string } } }, 1],
				[
					{
						children: [
							{
								string: 1 as unknown as string,
							} satisfies FilterObject<SchemaNested>["children"],
						] as never,
					},
					1,
				],
			];

			for (const [filter, nError] of filters) {
				const result = filterSchema.safeParse(
					filter,
				) as z.SafeParseError<FilterObject<SchemaNested>>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});
	});

	describe("With discriminated union", () => {});
});
