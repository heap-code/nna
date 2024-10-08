import * as z from "zod";

import { schemaCommon } from "./model.common";

type Type = z.infer<typeof schemaCommon>;

describe("Model schema", () => {
	// These are very simple tests, there is no real need to test too much (~= no need to test `zod`)

	const MODELS: readonly Type[] = [
		{ createdAt: new Date(), updatedAt: new Date() },
		{ createdAt: new Date(0), updatedAt: new Date() },
	];

	it("should parse normally", () => {
		for (const toParse of MODELS) {
			expect(schemaCommon.parse(toParse)).toStrictEqual(toParse);
		}
	});

	it("should remove extraneous values", () => {
		for (const toParse of MODELS) {
			expect(
				schemaCommon.parse({
					...toParse,
					[Math.random().toString()]: Math.random(),
				}),
			).toStrictEqual(toParse);
		}
	});

	describe("Errors", () => {
		it("should fail when a property is missing", () => {
			const [{ createdAt: _, ...model }] = MODELS;
			expect(schemaCommon.safeParse(model).success).toBe(false);
		});

		it("should fail when a property is wrongly typed", () => {
			expect(
				schemaCommon.safeParse({
					...MODELS[0],
					createdAt: 13124,
				} satisfies Record<keyof Type, unknown>).success,
			).toBe(false);
		});
	});
});
