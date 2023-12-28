import { z } from "zod";

import {
	schema,
	schemaOperators,
	schemaStrict,
	Type,
	Operators,
} from "./boolean";

describe("Boolean filter", () => {
	describe("Validation", () => {
		it("should be valid", () => {
			const filters: readonly Type[] = [
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
			const filters: readonly Type[] = [
				"101" as unknown as boolean,
				null as unknown as boolean,
				{ $gt: "101" as unknown as boolean },
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(false);
			}
		});

		it("should not be valid (operators only)", () => {
			const filters: ReadonlyArray<[Operators, number]> = [
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
				const result = schemaOperators.safeParse(
					filter,
				) as z.SafeParseError<Type>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});

		it("should not be valid with extraenous values (strict)", () => {
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- For test
			const toParse = { a: 2 } as Type;
			expect(schemaStrict.safeParse(toParse).success).toBe(false);
		});
	});

	describe("Transformation", () => {
		it("should remove extraenous values", () => {
			const toParse: Type = {
				$eq: false,
				$exists: true,
				$in: [true, false],
			};
			expect(schema.parse({ ...toParse, a: "2" })).toStrictEqual(toParse);
		});
	});
});
