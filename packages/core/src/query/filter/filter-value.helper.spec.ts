import * as z from "zod";

import { isFilterValueConvertible } from "./filter-value.helper";

describe("FilterValue schema", () => {
	enum MyEnum {
		A = "a",
		B = "b",
		C = "c",
	}

	it("isFilterValueConvertible", () => {
		const tests: Array<[z.ZodType, boolean]> = [
			[z.string(), true],
			[z.string().readonly(), true],
			[z.number(), true],
			[z.date(), true],
			[z.date().nullable(), true],
			[z.boolean(), true],
			[z.boolean().optional(), true],
			[z.enum(["a", "b", "c"]), true],
			[z.enum(["a", "b", "c"]).nullable(), true],
			[z.nativeEnum(MyEnum), true],
			[z.number().max(10).min(1), true],
			[z.number().max(10).min(1).readonly(), true],
			[z.string().min(3), true],
			[z.object({}), false],
			[z.object({}).nullable(), false],
			[z.custom(), false],
		];

		for (const [schema, expected] of tests) {
			expect(isFilterValueConvertible(schema)).toBe(expected);
		}
	});
});
