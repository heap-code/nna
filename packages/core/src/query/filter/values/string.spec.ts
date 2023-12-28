import { z } from "zod";

import {
	schema,
	schemaOperators,
	schemaStrict,
	Type,
	Operators,
} from "./string";

describe("String filter", () => {
	describe("Validation", () => {
		it("should be valid", () => {
			const filters: readonly Type[] = [
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
				{ $exists: false },
				{ $like: "abc", $re: "def" },
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: readonly Type[] = [
				1 as unknown as string,
				null as unknown as string,
				{ $eq: 1 as unknown as string },
				{ $eq: null as unknown as string },
			];

			for (const filter of filters) {
				expect(schemaOperators.safeParse(filter).success).toBe(false);
			}
		});

		it("should not be valid (operators only)", () => {
			const filters: ReadonlyArray<[Operators, number]> = [
				[{ $eq: 1 as unknown as string }, 1],
				[{ $eq: null as unknown as string }, 1],
				[
					{
						$exists: 2 as unknown as boolean,
						$in: ["3", 4 as unknown as string],
					},
					2,
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
				$eq: "abc",
				$exists: true,
				$in: ["a", "b"],
			};
			expect(schema.parse({ ...toParse, a: "2" })).toStrictEqual(toParse);
		});
	});
});
