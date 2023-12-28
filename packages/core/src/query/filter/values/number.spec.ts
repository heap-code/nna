import { z } from "zod";

import {
	schema,
	schemaOperators,
	schemaStrict,
	Type,
	Operators,
} from "./number";

describe("Number filter", () => {
	describe("Validation", () => {
		it("should be valid", () => {
			const filters: readonly Type[] = [
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
			const filters: readonly Type[] = [
				"101" as unknown as number,
				null as unknown as number,
				{ $gt: "101" as unknown as number },
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(false);
			}
		});

		it("should not be valid (operators only)", () => {
			const filters: ReadonlyArray<[Operators, number]> = [
				[{ $eq: "a" as unknown as number }, 1],
				[{ $eq: null as unknown as number }, 1],
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
				$eq: 123,
				$exists: true,
				$in: [1, 2],
			};
			expect(schema.parse({ ...toParse, a: "2" })).toStrictEqual(toParse);
		});
	});
});
