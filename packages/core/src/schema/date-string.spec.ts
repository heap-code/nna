import * as z from "zod";

import { dateString } from "./date-string";

describe("dateString", () => {
	describe("Validation", () => {
		it("should work with non-nullable schema", () => {
			for (const [data, expected] of [
				["2000-01-01T00:00:00.000Z", true],
				["1970-02-03T01:23:45.678Z", true],
				["2000-01-0112:00:00.000Z", false],
				["2000-01-01", false],
			] satisfies Array<[string, boolean]>) {
				expect(dateString.safeParse(data).success).toBe(expected);
			}
		});

		it("should work with nullable schema", () => {
			const schema = dateString.nullable();

			for (const [data, expected] of [
				["2000-01-01T12:00:00.000Z", true],
				["1970-02-03T01:23:45.678Z", true],
				[null, true],
				["2000-01-0100:00:00.000Z", false],
				["2000-01-01", false],
				["null", false],
			] satisfies Array<[string | null, boolean]>) {
				expect(schema.safeParse(data).success).toBe(expected);
			}
		});

		it("should work with date constraints", () => {
			const dateRef = new Date(2000, 0).toISOString();

			for (const [schema, expected] of [
				[z.date(), true],
				[z.date().min(new Date(1999, 0)), true],
				[z.date().max(new Date(2001, 0)), true],
				[z.date().min(new Date(2001, 0)), false],
				[z.date().max(new Date(1999, 0)), false],
			] satisfies Array<[z.ZodTypeAny, boolean]>) {
				expect(dateString.pipe(schema).safeParse(dateRef).success).toBe(
					expected,
				);
			}
		});
	});

	it("should transform correctly", () => {
		expect(dateString.parse("2000-01-01T00:00:00.000Z")).toStrictEqual(
			new Date(2000, 0),
		);

		expect(
			dateString.nullable().parse("2000-01-01T00:00:00.000Z"),
		).toStrictEqual(new Date(2000, 0));

		expect(dateString.nullable().parse(null)).toBeNull();
	});
});
