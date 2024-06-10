import * as z from "zod";

import { paramsSchema } from "./param";

describe("HttpRouteParam", () => {
	describe("paramsSchema", () => {
		const schema = paramsSchema([
			{ param: "a", validation: "number" },
			{ param: "b", validation: "string" },
		]);
		type Schema = z.infer<typeof schema>;

		it("should validate and parse", () => {
			for (const [test, expected] of [
				[
					{ a: 1, b: "a" },
					{ a: 1, b: "a" },
				],
				[
					{ a: "2", b: "b" },
					{ a: 2, b: "b" },
				],
			] satisfies Array<
				[Record<keyof Schema, number | string>, Schema]
			>) {
				expect(schema.parse(test)).toStrictEqual(expected);
			}
		});

		it("should invalid", () => {
			for (const test of [{}, { a: 123 }, { b: "123" }] satisfies Array<
				Partial<Schema>
			>) {
				expect(schema.safeParse(test).success).toBe(false);
			}
		});
	});
});
