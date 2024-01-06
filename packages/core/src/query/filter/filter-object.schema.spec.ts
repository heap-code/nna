import { z } from "zod";

import { FilterObject } from "./filter-object";
import * as Filter from "./filter-object.schema";

enum MyEnum {
	A = "0",
	B = "1",
}

const schemaFlat = z.object({
	boolean: z.boolean(),
	booleanNullable: z.boolean().nullable(),
	date: z.date(),
	dateNullable: z.date().nullable(),
	enumNative: z.nativeEnum(MyEnum),
	enumNativeNullable: z.nativeEnum(MyEnum).nullable(),
	enumZod: z.enum(["a", "b", "c"]),
	enumZodNullable: z.enum(["a", "b"]).nullable(),
	number: z.number(),
	numberNullable: z.number().nullable(),
	string: z.string(),
	stringNullable: z.string().nullable(),
});
type SchemaFlat = z.infer<typeof schemaFlat>;

describe("QueryObjectFilter schema", () => {
	describe("With flat objects", () => {
		const filterSchema = Filter.object(schemaFlat);

		it("should be valid", () => {
			const filters: Array<FilterObject<SchemaFlat>> = [
				{
					boolean: true,
					booleanNullable: false,
					date: new Date(),
					dateNullable: new Date(),
					enumNative: MyEnum.A,
					enumNativeNullable: MyEnum.B,
					enumZod: "a",
					enumZodNullable: "b",
					number: 1,
					numberNullable: 2,
					string: "abc",
					stringNullable: "def",
				},
				{
					booleanNullable: null,
					dateNullable: null,
					enumNativeNullable: null,
					enumZodNullable: null,
					numberNullable: null,
					stringNullable: null,
				},
				{
					boolean: true,
					enumNative: { $ne: MyEnum.A },
					enumZod: { $in: ["a", "b"] },
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
			unknow: z.array(z.custom()),
		});
		type SchemaNested = z.infer<typeof schemaNested>;

		const filterSchema = Filter.object(schemaNested);

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
				// Unkown type => no schema
				[{ unknow: {} }, 1],
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

		const filterSchema = Filter.object(schemaWithDiscrimination, {
			strict: true,
		});

		it("should be valid", () => {
			const filters: Array<FilterObject<SchemaWithDiscrimination>> = [
				{ child: { number: { $eq: 2 } } },
				{ discriminated: { type: "idle" } },
				{
					discriminated: {
						// `as "error"` comes from Zod
						type: { $in: ["error", "success" as "error"] },
					},
				},
				{
					child: {
						discriminated: { date: { $ne: null }, type: "idle" },
					},
					discriminated: { code: 404, type: "error" },
				},
				{ discriminated: { data: { $like: "abc" }, type: "success" } },
			];

			for (const filter of filters) {
				const results = filterSchema.safeParse(
					filter,
				) as z.SafeParseSuccess<never>;
				expect(results.success).toBe(true);
				expect(results.data).toStrictEqual(filter);
			}
		});

		it("should not be valid", () => {
			const filters: Array<
				[FilterObject<SchemaWithDiscrimination>, number]
			> = [
				[{ discriminated: { code: 400 } }, 1],
				[{ discriminated: { code: 400, type: "success" } }, 1],
				[{ discriminated: { data: { $gt: "abc" }, type: "idle" } }, 1],
			];

			for (const [filter, nError] of filters) {
				const result = filterSchema.safeParse(
					filter,
				) as z.SafeParseError<FilterObject<SchemaWithDiscrimination>>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});
	});
});
