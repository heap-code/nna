import { Type, schema } from "./model.string";

describe("Model schema", () => {
	// These are very simple tests, there is no real need to test too much (~= no need to test `zod`)

	const MODELS: readonly Type[] = [
		{
			_id: "1",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: "10",
			createdAt: new Date(0),
			updatedAt: new Date(),
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
			const [{ _id: _, ...model }] = MODELS;
			expect(schema.safeParse(model).success).toBe(false);
		});

		it("should fail when a property is wrongly typed", () => {
			expect(
				schema.safeParse({
					...MODELS[0],
					_id: 123,
				} satisfies Record<keyof Type, unknown>).success,
			).toBe(false);
		});
	});
});
