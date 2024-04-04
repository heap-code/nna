import * as z from "zod";

import * as Filter from "./number";

describe("Number filter", () => {
	const schema = Filter.number();
	const schemaCoerce = Filter.number({ coerce: true });

	describe("Validation", () => {
		it("should be valid", () => {
			const filters: readonly Filter.NumberFilter[] = [
				101,
				{ $eq: 1, $gt: 2, $gte: 3, $lt: 4, $lte: 5, $ne: 6 },
				{ $in: [7, 8], $nin: [9, 0] },
				{ $exists: true, $nin: [] },
				{ $exists: false },
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: ReadonlyArray<[Filter.NumberFilter, number]> = [
				["101" as unknown as number, 1],
				[null as unknown as number, 1],
				[
					{
						$eq: "a" as unknown as number,
						$gt: "101" as unknown as number,
					},
					2,
				],
				[{ $eq: null as unknown as number }, 1],
				[
					{
						$exists: 2 as unknown as boolean,
						$in: [4, "3" as unknown as number],
					},
					2,
				],
			];

			for (const [filter, nError] of filters) {
				const result = schema.safeParse(
					filter,
				) as z.SafeParseError<Filter.NumberFilter>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});

		it("should not be valid with extraenous values (strict mode)", () => {
			expect(
				Filter.number({ strict: true }).safeParse({ a: 2 }).success,
			).toBe(false);
		});

		describe("With coerce option", () => {
			it("should be valid", () => {
				const filters: readonly Filter.NumberFilter[] = [
					"101" as unknown as number,
					{ $in: [2, "10e2" as unknown as number] },
				];
				for (const filter of filters) {
					expect(schemaCoerce.safeParse(filter).success).toBe(true);
				}
			});

			it("should not be valid", () => {
				const filters: ReadonlyArray<[Filter.NumberFilter, number]> = [
					["abc" as unknown as number, 1],
					[
						{
							$eq: "null" as unknown as number,
							$in: [2, "def" as unknown as number],
						},
						2,
					],
				];

				for (const [filter, nError] of filters) {
					const result = schemaCoerce.safeParse(
						filter,
					) as z.SafeParseError<Filter.NumberFilter>;

					expect(result.success).toBe(false);
					expect(result.error.errors).toHaveLength(nError);
				}
			});
		});
	});

	describe("Transformation", () => {
		it("should remove extraenous values", () => {
			const toParse: Filter.NumberFilter = {
				$eq: 123,
				$exists: true,
				$in: [1, 2],
			};
			expect(schema.parse({ ...toParse, a: "2" })).toStrictEqual(toParse);
		});

		describe("With coerce option", () => {
			it("should cast values", () => {
				const tests: Array<[Filter.NumberFilter, Filter.NumberFilter]> =
					[
						[null as unknown as number, 0],
						["123" as unknown as number, 123],
						[
							{
								$eq: "1" as unknown as number,
								$in: ["2" as unknown as number, 3],
							},
							{ $eq: 1, $in: [2, 3] },
						],
					];

				for (const [toParse, expected] of tests) {
					expect(schemaCoerce.parse(toParse)).toStrictEqual(expected);
				}
			});
		});
	});
});

describe("Nullable number filter", () => {
	const schema = Filter.number({ nullable: true });
	const schemaCoerce = Filter.number({ coerce: true, nullable: true });

	describe("Validation", () => {
		it("should be valid", () => {
			const filters: readonly Filter.NumberFilterNullable[] = [
				101,
				null,
				{ $eq: 1, $gt: 2, $gte: 3, $lt: 4, $lte: 5, $ne: 6 },
				{ $in: [null, 8], $nin: [9, 0] },
				{ $exists: true, $nin: [] },
				{ $exists: false },
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: ReadonlyArray<
				[Filter.NumberFilterNullable, number]
			> = [
				["101" as unknown as number, 1],
				[{ $eq: "a" as unknown as number }, 1],
				[
					{
						$exists: 2 as unknown as boolean,
						$in: [4, "3" as unknown as number],
					},
					2,
				],
				[{ $ne: new Date().toISOString() as unknown as number }, 1],
			];

			for (const [filter, nError] of filters) {
				const result = schema.safeParse(
					filter,
				) as z.SafeParseError<Filter.NumberFilterNullable>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});

		it("should not be valid with extraenous values (strict)", () => {
			expect(
				Filter.number({ nullable: true, strict: true }).safeParse({
					a: 2,
				}).success,
			).toBe(false);
		});

		describe("With coerce option", () => {
			it("should be valid", () => {
				const filters: readonly Filter.NumberFilterNullable[] = [
					null as unknown as null,
					"null" as unknown as number,
					"101" as unknown as number,
					{
						$in: [
							1,
							"null" as unknown as null,
							"10e2" as unknown as number,
						],
					},
				];
				for (const filter of filters) {
					expect(schemaCoerce.safeParse(filter).success).toBe(true);
				}
			});

			it("should not be valid", () => {
				const filters: ReadonlyArray<
					[Filter.NumberFilterNullable, number]
				> = [
					["abc" as unknown as number, 1],
					[
						{
							$gt: "null" as unknown as number,
							$in: [2, "def" as unknown as number],
						},
						2,
					],
				];

				for (const [filter, nError] of filters) {
					const result = schemaCoerce.safeParse(
						filter,
					) as z.SafeParseError<Filter.NumberFilterNullable>;

					expect(result.success).toBe(false);
					expect(result.error.errors).toHaveLength(nError);
				}
			});
		});
	});

	describe("Transformation", () => {
		it("should remove extraenous values", () => {
			const toParse: Filter.NumberFilterNullable = {
				$exists: true,
				$in: [1, null],
			};
			expect(schema.parse({ ...toParse, a: "2" })).toStrictEqual(toParse);
		});

		describe("With coerce option", () => {
			it("should cast values", () => {
				const tests: Array<
					[Filter.NumberFilterNullable, Filter.NumberFilterNullable]
				> = [
					["123" as unknown as number, 123],
					["null" as unknown as number, null],
					[null as unknown as number, null],
					[
						{
							$eq: "null" as unknown as null,
							$in: ["2" as unknown as number, 3],
						},
						{ $eq: null, $in: [2, 3] },
					],
				];

				for (const [toParse, expected] of tests) {
					expect(schemaCoerce.parse(toParse)).toStrictEqual(expected);
				}
			});
		});
	});
});
