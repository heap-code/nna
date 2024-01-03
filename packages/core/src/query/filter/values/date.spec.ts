import { z } from "zod";

import * as Filter from "./date";

const now = new Date();

describe("Date filter", () => {
	const schema = Filter.date();
	const schemaCoerce = Filter.date({ coerce: true });

	describe("Validation", () => {
		it("should be valid", () => {
			const filters: readonly Filter.DateFilter[] = [
				new Date(),
				{
					$eq: new Date(),
					$gt: new Date(),
					$gte: new Date(),
					$lt: new Date(),
					$lte: new Date(),
					$ne: new Date(),
				},
				{
					$in: [new Date(), new Date()],
					$nin: [new Date(), new Date()],
				},
				{ $exists: true, $nin: [] },
				{ $exists: false },
				{ $like: "abc", $re: "def" },
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: ReadonlyArray<[Filter.DateFilter, number]> = [
				[1 as unknown as Date, 1],
				[null as unknown as Date, 1],
				[{ $eq: 1 as unknown as string }, 1],
				[{ $eq: null as unknown as string }, 1],
				[
					{
						$exists: 2 as unknown as boolean,
						$in: ["3", 4 as unknown as Date],
					},
					3,
				],
				[{ $ne: null }, 1],
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
				) as z.SafeParseError<Type>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});

		it("should not be valid with extraenous values (strict)", () => {
			expect(
				Filter.date({ strict: true }).safeParse({ a: 2 }).success,
			).toBe(false);
		});

		describe("With coerce option", () => {
			it("should be valid", () => {
				const filters: readonly Filter.DateFilter[] = [
					"1970-01-01" as unknown as Date,
					{ $in: [0 as unknown as Date] },
				];
				for (const filter of filters) {
					expect(schemaCoerce.safeParse(filter).success).toBe(true);
				}
			});

			it("should not be valid", () => {
				const filters: ReadonlyArray<[Filter.DateFilter, number]> = [
					["abc" as unknown as Date, 1],
					[
						{
							$eq: "null" as unknown as Date,
							$in: ["def" as unknown as Date],
						},
						2,
					],
				];

				for (const [filter, nError] of filters) {
					const result = schemaCoerce.safeParse(
						filter,
					) as z.SafeParseError<Filter.DateFilter>;

					expect(result.success).toBe(false);
					expect(result.error.errors).toHaveLength(nError);
				}
			});
		});
	});

	describe("Transformation", () => {
		it("should remove extraenous values", () => {
			const toParse: Filter.DateFilter = {
				$eq: new Date(),
				$exists: true,
				$in: [new Date(), new Date()],
			};
			expect(schema.parse({ ...toParse, a: "2" })).toStrictEqual(toParse);
		});

		describe("With coerce option", () => {
			it("should cast values", () => {
				const tests: Array<[Filter.DateFilter, Filter.DateFilter]> = [
					[null as unknown as Date, new Date(0)],
				];

				for (const [toParse, expected] of tests) {
					expect(schemaCoerce.parse(toParse)).toStrictEqual(expected);
				}
			});
		});
	});
});

describe("Nullable date filter", () => {
	const schema = Filter.date({ nullable: true });
	const schemaCoerce = Filter.date({ coerce: true, nullable: true });

	describe("Validation", () => {
		it("should be valid", () => {
			const filters: readonly Filter.DateFilterNullable[] = [
				new Date(),
				null,
				{
					$eq: null,
					$gt: new Date(),
					$gte: new Date(),
					$lt: new Date(),
					$lte: new Date(),
					$ne: new Date(),
				},
				{
					$in: [null, new Date()],
					$nin: [new Date(), new Date()],
				},
				{ $exists: true, $nin: [] },
				{ $exists: false },
				{ $like: "abc", $re: "def" },
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: readonly Filter.DateFilterNullable[] = [
				1 as unknown as Date,
				{ $eq: 1 as unknown as Date },
			];

			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(false);
			}
		});

		it("should not be valid (operators only)", () => {
			const filters: ReadonlyArray<[Filter.DateFilterNullable, number]> =
				[
					[{ $eq: 1 as unknown as string }, 1],
					[
						{
							$exists: 2 as unknown as boolean,
							$in: ["3", 4 as unknown as string],
						},
						3,
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
				) as z.SafeParseError<Filter.DateFilterNullable>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});

		it("should not be valid with extraenous values (strict)", () => {
			expect(
				Filter.date({ nullable: true, strict: true }).safeParse({
					a: 2,
				}).success,
			).toBe(false);
		});

		describe("With coerce option", () => {
			it("should be valid", () => {
				const filters: readonly Filter.DateFilterNullable[] = [
					null as unknown as null,
					"null" as unknown as Date,
					"101" as unknown as Date,
					{
						$in: [0 as unknown as Date, "null" as unknown as null],
					},
				];
				for (const filter of filters) {
					expect(schemaCoerce.safeParse(filter).success).toBe(true);
				}
			});

			it("should not be valid", () => {
				const filters: ReadonlyArray<
					[Filter.DateFilterNullable, number]
				> = [
					["abc" as unknown as Date, 1],
					[
						{
							$gt: "null" as unknown as Date,
							$in: [
								2 as unknown as Date,
								"def" as unknown as Date,
							],
						},
						2,
					],
				];

				for (const [filter, nError] of filters) {
					const result = schemaCoerce.safeParse(
						filter,
					) as z.SafeParseError<Filter.DateFilterNullable>;

					expect(result.success).toBe(false);
					expect(result.error.errors).toHaveLength(nError);
				}
			});
		});
	});

	describe("Transformation", () => {
		it("should remove extraenous values", () => {
			const toParse: Filter.DateFilterNullable = {
				$eq: new Date(),
				$exists: true,
				$in: [null, new Date()],
			};
			expect(schema.parse({ ...toParse, a: "2" })).toStrictEqual(toParse);
		});

		describe("With coerce option", () => {
			it("should cast values", () => {
				const tests: Array<
					[Filter.DateFilterNullable, Filter.DateFilterNullable]
				> = [
					[now.getTime() as unknown as Date, now],
					["null" as unknown as Date, null],
					[null as unknown as Date, null],
					[
						{
							$eq: "null" as unknown as null,
							$in: [now, now.toISOString() as unknown as Date],
						},
						{ $eq: null, $in: [now, now] },
					],
				];

				for (const [toParse, expected] of tests) {
					expect(schemaCoerce.parse(toParse)).toStrictEqual(expected);
				}
			});
		});
	});
});
