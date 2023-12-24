import { Type, schema } from "./model";

describe("Model schema", () => {
	// These are very simple tests, there is no real need to test too much (~= no need to test `zod`)

	const MODELS: readonly Type[] = [
		{
			_id: 1,
			create_at: new Date(),
			update_at: new Date(),
		},
		{
			_id: 10,
			create_at: new Date(0),
			update_at: new Date(),
		},
	];

	it("should parse normally", () => {
		for (const toParse of MODELS) {
			expect(schema.parse(toParse)).toStrictEqual(toParse);
		}
	});

	it("should remove extraneous values", () => {
		for (const toParse of MODELS) {
			expect(
				schema.parse({
					...toParse,
					[Math.random().toString()]: Math.random(),
				}),
			).toStrictEqual(toParse);
		}
	});

	describe("Errors", () => {
		it("should fail when a property is missing", () => {
			const { _id: _, ...model } = MODELS[0];
			expect(schema.safeParse(model).success).toBe(false);
		});

		it("should fail when a property is wrongly typed", () => {
			expect(
				schema.safeParse({
					...MODELS[0],
					_id: "abc",
				} satisfies Record<keyof Type, unknown>).success,
			).toBe(false);
		});

		it("should fail when `_id` is negative", () => {
			expect(
				schema.safeParse({
					...MODELS[0],
					_id: -10,
				} satisfies Type).success,
			).toBe(false);
		});
	});
});
