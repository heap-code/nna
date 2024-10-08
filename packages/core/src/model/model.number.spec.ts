import { Type, schema } from "./model.number";

describe("Model schema", () => {
	// These are very simple tests, there is no real need to test too much (~= no need to test `zod`)

	const MODELS: readonly Type[] = [
		{
			_id: 1,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: 10,
			createdAt: new Date(0),
			updatedAt: new Date(),
		},
	];

	it("should parse normally", () => {
		for (const toParse of MODELS) {
			expect(schema.parse(toParse)).toStrictEqual(toParse);
		}
	});

	describe("Errors", () => {
		it("should fail when a property is missing", () => {
			const [{ _id: _, ...model }] = MODELS;
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
