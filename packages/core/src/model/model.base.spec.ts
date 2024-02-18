import * as z from "zod";

import { schemaBase } from "./model.base";

type Type = z.infer<typeof schemaBase>;

describe("Model schema", () => {
	// These are very simple tests, there is no real need to test too much (~= no need to test `zod`)

	const MODELS: readonly Type[] = [
		{ createdAt: new Date(), updatedAt: new Date() },
		{ createdAt: new Date(0), updatedAt: new Date() },
	];

	it("should parse normally", () => {
		for (const toParse of MODELS) {
			expect(schemaBase.parse(toParse)).toStrictEqual(toParse);
		}
	});

	it("should remove extraneous values", () => {
		for (const toParse of MODELS) {
			expect(
				schemaBase.parse({
					...toParse,
					[Math.random().toString()]: Math.random(),
				}),
			).toStrictEqual(toParse);
		}
	});

	describe("Errors", () => {
		it("should fail when a property is missing", () => {
			const { createdAt: _, ...model } = MODELS[0];
			expect(schemaBase.safeParse(model).success).toBe(false);
		});

		it("should fail when a property is wrongly typed", () => {
			expect(
				schemaBase.safeParse({
					...MODELS[0],
					createdAt: 13124,
				} satisfies Record<keyof Type, unknown>).success,
			).toBe(false);
		});
	});
});
