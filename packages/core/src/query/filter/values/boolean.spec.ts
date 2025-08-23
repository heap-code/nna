import * as Filter from "./boolean";

describe("Boolean filter", () => {
	const schema = Filter.boolean();
	const schemaCoerce = Filter.boolean({ coerce: true });

	describe("Validation", () => {
		it("should be valid", () => {
			const filters: readonly Filter.BooleanFilter[] = [
				true,
				{
					$eq: true,
					$gt: false,
					$gte: false,
					$lt: true,
					$lte: false,
					$ne: true,
				},
				{ $in: [false, true], $nin: [false, true] },
				{ $exists: true, $nin: [] },
				{ $exists: false },
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: ReadonlyArray<[Filter.BooleanFilter, number]> = [
				["101" as unknown as boolean, 1],
				[null as unknown as boolean, 1],
				[{ $eq: "a" as unknown as boolean }, 1],
				[
					{
						$exists: 2 as unknown as boolean,
						$in: [true, "3" as unknown as boolean],
					},
					2,
				],
				[{ $ne: new Date().toISOString() as unknown as boolean }, 1],
			];

			for (const [filter, nError] of filters) {
				const result = schema.safeParse(filter);

				expect(result.success).toBe(false);
				expect(result.error?.issues).toHaveLength(nError);
			}
		});

		it("should not be valid with extraenous values (strict)", () => {
			expect(
				Filter.boolean({ strict: true }).safeParse({ a: 2 }).success,
			).toBe(false);
		});

		describe("With coerce option", () => {
			it("should be valid", () => {
				const filters: readonly Filter.BooleanFilter[] = [
					"true" as unknown as boolean,
					{ $in: [true, "false" as unknown as boolean] },
				];
				for (const filter of filters) {
					expect(schemaCoerce.safeParse(filter).success).toBe(true);
				}
			});

			it("should not be valid", () => {
				const filters: ReadonlyArray<[Filter.BooleanFilter, number]> = [
					["abc" as unknown as boolean, 1],
					[
						{
							$eq: "null" as unknown as boolean,
							$in: [
								2 as unknown as boolean,
								"def" as unknown as boolean,
							],
						},
						3,
					],
				];

				for (const [filter, nError] of filters) {
					const result = schemaCoerce.safeParse(filter);

					expect(result.success).toBe(false);
					expect(result.error?.issues).toHaveLength(nError);
				}
			});
		});
	});

	describe("Transformation", () => {
		it("should remove extraenous values", () => {
			const toParse: Filter.BooleanFilter = {
				$eq: false,
				$exists: true,
				$in: [true, false],
			};
			expect(schema.parse({ ...toParse, a: "2" })).toStrictEqual(toParse);
		});

		describe("With coerce option", () => {
			it("should cast values", () => {
				const tests: Array<
					[Filter.BooleanFilter, Filter.BooleanFilter]
				> = [["true" as unknown as boolean, true]];

				for (const [toParse, expected] of tests) {
					expect(schemaCoerce.parse(toParse)).toStrictEqual(expected);
				}
			});
		});
	});
});

describe("Nullable boolean filter", () => {
	const schema = Filter.boolean({ nullable: true });
	const schemaCoerce = Filter.boolean({ coerce: true, nullable: true });

	describe("Validation", () => {
		it("should be valid", () => {
			const filters: readonly Filter.BooleanFilterNullable[] = [
				true,
				null,
				{
					$eq: true,
					$gt: false,
					$gte: false,
					$lt: true,
					$lte: false,
					$ne: null,
				},
				{ $in: [null, true], $nin: [false, true] },
				{ $exists: true, $nin: [] },
				{ $exists: false },
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: ReadonlyArray<
				[Filter.BooleanFilterNullable, number]
			> = [
				["101" as unknown as boolean, 1],
				[{ $eq: "a" as unknown as boolean }, 1],
				[
					{
						$exists: 2 as unknown as boolean,
						$in: [true, "3" as unknown as boolean],
					},
					2,
				],
				[{ $ne: new Date().toISOString() as unknown as boolean }, 1],
			];

			for (const [filter, nError] of filters) {
				const result = schema.safeParse(filter);

				expect(result.success).toBe(false);
				expect(result.error?.issues).toHaveLength(nError);
			}
		});

		it("should not be valid with extraenous values (strict)", () => {
			expect(
				Filter.boolean({ nullable: true, strict: true }).safeParse({
					a: 2,
				}).success,
			).toBe(false);
		});

		describe("With coerce option", () => {
			it("should be valid", () => {
				const filters: readonly Filter.BooleanFilterNullable[] = [
					null as unknown as null,
					"null" as unknown as null,
					"true" as unknown as boolean,
					{
						$in: ["null" as unknown as null, false],
					},
				];
				for (const filter of filters) {
					expect(schemaCoerce.safeParse(filter).success).toBe(true);
				}
			});

			it("should not be valid", () => {
				const filters: ReadonlyArray<
					[Filter.BooleanFilterNullable, number]
				> = [
					//["abc" as unknown as boolean, 1],
					[
						{
							$gt: "null" as unknown as boolean,
							$in: [true, "abc" as unknown as boolean],
						},
						2,
					],
				];

				for (const [filter, nError] of filters) {
					const result = schemaCoerce.safeParse(filter);

					expect(result.success).toBe(false);
					expect(result.error?.issues).toHaveLength(nError);
				}
			});
		});
	});

	describe("Transformation", () => {
		it("should remove extraenous values", () => {
			const toParse: Filter.BooleanFilterNullable = {
				$eq: false,
				$exists: true,
				$in: [true, null],
			};
			expect(schema.parse({ ...toParse, a: "2" })).toStrictEqual(toParse);
		});

		describe("With coerce option", () => {
			it("should cast values", () => {
				const tests: Array<
					[Filter.BooleanFilterNullable, Filter.BooleanFilterNullable]
				> = [
					["false" as unknown as boolean, false],
					["null" as unknown as null, null],
					[null as unknown as null, null],
					[
						{
							$eq: "null" as unknown as null,
							$in: ["false" as unknown as boolean, true],
						},
						{ $eq: null, $in: [false, true] },
					],
				];

				for (const [toParse, expected] of tests) {
					expect(schemaCoerce.parse(toParse)).toStrictEqual(expected);
				}
			});
		});
	});
});
