import { z } from "zod";

import * as Filter from "./string";

describe("String filter", () => {
	const schema = Filter.string();
	const schemaCoerce = Filter.string({ coerce: true });

	describe("Validation", () => {
		it("should be valid", () => {
			const filters: readonly Filter.StringFilter[] = [
				"a string",
				{
					$eq: "1",
					$gt: "2",
					$gte: "3",
					$lt: "4",
					$lte: "5",
					$ne: "6",
				},
				{ $in: ["7", "8"], $nin: ["9", "0"] },
				{ $exists: true, $nin: [] },
				{ $like: "abc", $re: "def" },
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: ReadonlyArray<[Filter.StringFilter, number]> = [
				[1 as unknown as string, 1],
				[null as unknown as string, 1],
				[{ $eq: 1 as unknown as string }, 1],
				[{ $eq: null as unknown as string }, 1],
				[
					{
						$exists: 2 as unknown as boolean,
						$in: ["3", 4 as unknown as string],
					},
					2,
				],
				[
					{
						$like: new Date() as unknown as string,
						$ne: null,
						$re: 3 as unknown as string,
					},
					3,
				],
			];

			for (const [filter, nError] of filters) {
				const result = schema.safeParse(
					filter,
				) as z.SafeParseError<Filter.StringFilter>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});

		it("should not be valid with extraenous values (with strict)", () => {
			expect(
				Filter.string({ strict: true }).safeParse({ a: 2 }).success,
			).toBe(false);
		});

		describe("With coerce option", () => {
			it("should be valid", () => {
				const filters: readonly Filter.StringFilter[] = [
					"101" as unknown as string,
					{ $in: ["2", 10e2 as unknown as string] },
				];
				for (const filter of filters) {
					expect(schemaCoerce.safeParse(filter).success).toBe(true);
				}
			});
		});
	});

	describe("Transformation", () => {
		it("should remove extraenous values", () => {
			const toParse: Filter.StringFilter = {
				$eq: "abc",
				$exists: true,
				$in: ["a", "b"],
			};
			expect(schema.parse({ ...toParse, a: "2" })).toStrictEqual(toParse);
		});

		describe("With coerce option", () => {
			it("should cast values", () => {
				const tests: Array<[Filter.StringFilter, Filter.StringFilter]> =
					[
						[null as unknown as string, "null"],
						[123 as unknown as string, "123"],
						[
							{
								$eq: 1 as unknown as string,
								$in: [2 as unknown as string, "3"],
							},
							{ $eq: "1", $in: ["2", "3"] },
						],
					];

				for (const [toParse, expected] of tests) {
					expect(schemaCoerce.parse(toParse)).toStrictEqual(expected);
				}
			});
		});
	});
});

describe("Nullable string filter", () => {
	const schema = Filter.string({ nullable: true });
	const schemaCoerce = Filter.string({ coerce: true, nullable: true });

	describe("Validation", () => {
		it("should be valid", () => {
			const filters: readonly Filter.StringFilterNullable[] = [
				"a string",
				null,
				{
					$eq: "1",
					$gt: "2",
					$gte: "3",
					$lt: "4",
					$lte: "5",
					$ne: "6",
				},
				{ $in: ["7", "8", null], $nin: ["9", "0"] },
				{ $eq: null, $exists: true, $nin: [] },
				{ $exists: false, $like: "abc", $re: "def" },
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: ReadonlyArray<
				[Filter.StringFilterNullable, number]
			> = [
				[1 as unknown as string, 1],
				[{ $eq: 1 as unknown as string }, 1],
				[
					{
						$exists: 2 as unknown as boolean,
						$in: ["3", 4 as unknown as string],
					},
					2,
				],
				[
					{
						$like: new Date() as unknown as string,
						$re: 3 as unknown as string,
					},
					2,
				],
			];

			for (const [filter, nError] of filters) {
				const result = schema.safeParse(
					filter,
				) as z.SafeParseError<Filter.StringFilterNullable>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});

		it("should not be valid with extraenous values (strict)", () => {
			expect(
				Filter.string({ nullable: true, strict: true }).safeParse({
					a: 2,
				}).success,
			).toBe(false);
		});

		describe("With coerce option", () => {
			it("should be valid", () => {
				const filters: readonly Filter.StringFilterNullable[] = [
					null as unknown as null,
					"null" as unknown as null,
					101 as unknown as string,
					{
						$in: [
							1 as unknown as string,
							"null" as unknown as null,
							"10e2",
						],
					},
				];
				for (const filter of filters) {
					expect(schemaCoerce.safeParse(filter).success).toBe(true);
				}
			});
		});
	});

	describe("Transformation", () => {
		it("should remove extraenous values", () => {
			const toParse: Filter.StringFilterNullable = {
				$exists: true,
				$in: ["a", null],
			};
			expect(schema.parse({ ...toParse, a: "2" })).toStrictEqual(toParse);
		});

		describe("With coerce option", () => {
			it("should cast values", () => {
				const tests: Array<
					[Filter.StringFilterNullable, Filter.StringFilterNullable]
				> = [
					["null" as unknown as string, null],
					[null as unknown as string, null],
					[123 as unknown as string, "123"],
					[
						{
							$eq: "null" as unknown as null,
							$in: [2 as unknown as string, "3"],
						},
						{ $eq: null, $in: ["2", "3"] },
					],
				];

				for (const [toParse, expected] of tests) {
					expect(schemaCoerce.parse(toParse)).toStrictEqual(expected);
				}
			});
		});
	});
});
