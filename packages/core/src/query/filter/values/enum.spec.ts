import { z } from "zod";

import * as Value from "./enum";
import { FilterValue } from "../filter-value";

describe("Native enum filter", () => {
	enum Position {
		BOTTOM = "bottom",
		CENTER = "center",
		TOP = "top",
	}
	const Enum = z.nativeEnum(Position);
	type Value = z.infer<typeof Enum>;
	type Filter = FilterValue<Value>;
	const schema = Value.schema(Enum, {
		//nullable: true,
	});

	describe("Validation", () => {
		it("should be valid", () => {
			const filters: readonly Filter[] = [
				{ $eq: Position.BOTTOM, $in: [Position.CENTER, Position.TOP] },
				Position.CENTER,
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const filters: ReadonlyArray<[Filter, number]> = [
				[{ $gt: Position.BOTTOM, $in: [null, Position.TOP] }, 1],
				[null as unknown as Value, 1],
			];
			for (const [filter, nError] of filters) {
				const results = schema.safeParse(
					filter,
				) as z.SafeParseError<Filter>;
				expect(results.success).toBe(false);
				expect(results.error.errors).toHaveLength(nError);
			}
		});
	});

	describe("Validation (with null)", () => {
		type Filter = FilterValue<Value | null>;
		declare const schema: z.ZodType<Filter>;

		it("should be valid", () => {
			const filters: readonly Filter[] = [
				{ $eq: Position.BOTTOM, $in: [null, Position.TOP] },
				Position.CENTER,
				null,
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});
	});
});

describe("Zod enum filter", () => {
	const Enum = z.enum(["left", "middle", "right"]);
	type Value = z.infer<typeof Enum>;
	declare const schema: z.ZodType<FilterValue<Value>>;

	describe("Validation", () => {
		it("should be valid", () => {
			const filters: ReadonlyArray<FilterValue<Value>> = [
				"middle",
				{ $eq: "left", $in: ["middle", "right"] },
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});
	});

	it("should not be valid", () => {
		const filters: ReadonlyArray<[FilterValue<Value>, number]> = [
			[{ $gt: "left", $in: [null, "middle"] }, 1],
			[null as unknown as Value, 1],
		];
		for (const [filter, nError] of filters) {
			const results = schema.safeParse(filter) as z.SafeParseError<
				FilterValue<Value>
			>;
			expect(results.success).toBe(false);
			expect(results.error.errors).toHaveLength(nError);
		}
	});

	describe("Validation (with null)", () => {
		type Filter = FilterValue<Value | null>;
		declare const schema: z.ZodType<Filter>;

		it("should be valid", () => {
			const filters: readonly Filter[] = [
				{ $eq: "left", $in: [null, "middle"] },
				"right",
				null,
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});
	});
});
