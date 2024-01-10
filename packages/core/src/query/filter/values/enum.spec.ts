import { z } from "zod";

import * as FilterEnum from "./enum";
import { FilterValue } from "../filter-value";

describe("Native enum filter", () => {
	enum Position {
		BOTTOM = "bottom",
		CENTER = "center",
		TOP = 1,
	}
	const Enum = z.nativeEnum(Position);

	type Value = z.infer<typeof Enum>;
	type Filter = FilterValue<Value>;
	const schema = FilterEnum.enum(Enum);

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
		const schema = FilterEnum.enum(Enum, { nullable: true });

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

	describe("Transformation", () => {
		type Filter = FilterValue<Value | null>;
		const schema = FilterEnum.enum(Enum, {
			coerce: true,
			nullable: true,
		});

		it("should convert with coerce mode", () => {
			const filters: ReadonlyArray<[Filter, Filter]> = [
				[Position.BOTTOM, Position.BOTTOM],
				[null, null],
				["null" as unknown as Position, null],
				[Position.TOP.toString() as unknown as Position, Position.TOP],
			];
			for (const [filter, expected] of filters) {
				expect(schema.parse(filter)).toStrictEqual(expected);
			}
		});

		it("should fail with unkown 'coerced' value", () => {
			expect(
				schema.safeParse(`${Position.TOP.toString()}-no-coerce`)
					.success,
			).toBe(false);
		});
	});
});

describe("Zod enum filter", () => {
	const Enum = z.enum(["left", "middle", "right"]);
	type Value = z.infer<typeof Enum>;
	type Filter = FilterValue<Value>;
	const schema = FilterEnum.enum(Enum);

	describe("Validation", () => {
		it("should be valid", () => {
			const filters: readonly Filter[] = [
				"middle",
				{ $eq: "left", $in: ["middle", "right"] },
			];
			for (const filter of filters) {
				expect(schema.safeParse(filter).success).toBe(true);
			}
		});
	});

	it("should not be valid", () => {
		const filters: ReadonlyArray<[Filter, number]> = [
			[{ $gt: "left", $in: [null, "middle"] }, 1],
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

	describe("Validation (with null)", () => {
		type Filter = FilterValue<Value | null>;
		const schema = FilterEnum.enum(Enum, { nullable: true });

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
