import { Jsonify } from "type-fest";
import * as z from "zod";

import { objectForJson } from "./object-for-json";

describe("ObjectForJson", () => {
	const schemaBase = z
		.object({
			a: z.number(),
			b: z.string().min(2).nullable(),
			c: z.date().min(new Date(1990, 0)),
			d: z.date().nullable(),
		})
		.partial();

	it("should not modify the schema when there is no need", () => {
		const schema = schemaBase.pick({ a: true, b: true });
		expect(objectForJson(schema)).toBe(schema);
	});

	describe("On flat objects", () => {
		const schema = objectForJson(schemaBase);
		type Schema = z.infer<typeof schema>;
		type SchemaJson = Jsonify<Schema>;

		it("should validate", () => {
			for (const [toParse, expected] of [
				[{}, true],
				[{ a: 0, b: "ab" }, true],
				[{ c: "2000-01-01T12:00:00.000Z", d: null }, true],
				[{ a: "" as unknown as number }, false],
				[{ b: "" }, false],
				[{ c: "1980-01-01T12:00:00.000Z" }, false],
			] satisfies Array<[SchemaJson, boolean]>) {
				expect(schema.safeParse(toParse).success).toBe(expected);
			}
		});

		it("should transform", () => {
			expect(
				schema.parse({
					a: 10,
					c: "2010-01-01T00:00:00.000Z",
				} satisfies SchemaJson),
			).toStrictEqual({ a: 10, c: new Date(2010, 0) } satisfies Schema);
		});
	});

	describe("On nested objects", () => {
		const schema = objectForJson(
			schemaBase.extend({
				n: schemaBase.optional(),
				z: z.object({ a: z.number() }).optional(),
			}),
		);
		type Schema = z.infer<typeof schema>;
		type SchemaJson = Jsonify<Schema>;

		it("should validate", () => {
			for (const [toParse, expected] of [
				[{}, true],
				[{ a: 0, b: "ab", d: null }, true],
				[{ c: "2000-01-01T12:00:00.000Z" }, true],
				[{ n: { a: 1, b: "abc" } }, true],
				[{ n: { d: null } }, true],
				[{ n: { d: "2000-01-01T12:00:00.000Z" } }, true],
				[{ n: { c: null as unknown as string } }, false],
			] satisfies Array<[SchemaJson, boolean]>) {
				expect(schema.safeParse(toParse).success).toBe(expected);
			}
		});

		it("should transform", () => {
			expect(
				schema.parse({
					b: "10",
					n: { c: "2010-01-01T00:00:00.000Z" },
				} satisfies SchemaJson),
			).toStrictEqual({
				b: "10",
				n: { c: new Date(2010, 0) },
			} satisfies Schema);
		});
	});

	describe("With arrays", () => {
		const schema = objectForJson(
			schemaBase.extend({
				array: z.array(schemaBase).max(2).optional(),
				ns: z.array(z.number()).optional(),
			}),
		);
		type Schema = z.infer<typeof schema>;
		type SchemaJson = Jsonify<Schema>;

		it("should validate", () => {
			for (const [toParse, expected] of [
				[{ array: [] }, true],
				[{ ns: [] }, true],
				[{ c: "2010-01-01T00:00:00.000Z", ns: [1] }, true],
				[{ array: [{ c: "2010-01-01T00:00:00.000Z" }] }, true],
				[{ array: [{}, {}, {}] }, false],
			] satisfies Array<[SchemaJson, boolean]>) {
				expect(schema.safeParse(toParse).success).toBe(expected);
			}
		});

		it("should transform", () => {
			expect(
				schema.parse({
					array: [{ c: "2010-01-01T00:00:00.000Z" }],
					b: "10",
				} satisfies SchemaJson),
			).toStrictEqual({
				array: [{ c: new Date(2010, 0) }],
				b: "10",
			} satisfies Schema);
		});
	});

	describe("With lazy", () => {
		const schema = objectForJson(
			schemaBase
				.extend({
					n: z.lazy(() => schemaBase.optional()),
					x: z.lazy(() => z.object({ a: z.number() }).partial()),
					z: z.object({ a: z.lazy(() => z.number()) }).optional(),
				})
				.partial(),
		);
		type Schema = z.infer<typeof schema>;
		type SchemaJson = Jsonify<Schema>;

		it("should validate", () => {
			for (const [toParse, expected] of [
				[{}, true],
				[{ a: 0, b: "ab", d: null, x: {} }, true],
				[{ c: "2000-01-01T12:00:00.000Z" }, true],
				[{ n: { a: 1, b: "abc" } }, true],
				[{ n: { d: null } }, true],
				[{ n: { d: "2000-01-01T12:00:00.000Z" } }, true],
				[{ n: { c: null as unknown as string } }, false],
			] satisfies Array<[SchemaJson, boolean]>) {
				expect(schema.safeParse(toParse).success).toBe(expected);
			}
		});

		it("should transform", () => {
			expect(
				schema.parse({
					b: "10",
					n: { c: "2010-01-01T00:00:00.000Z" },
				} satisfies SchemaJson),
			).toStrictEqual({
				b: "10",
				n: { c: new Date(2010, 0) },
			} satisfies Schema);
		});
	});

	describe("On discriminated objects", () => {
		const schema = objectForJson(
			z.discriminatedUnion("_type", [
				z.object({ _type: z.literal("a"), a: z.date().optional() }),
				z.object({ _type: z.literal("b"), n: schemaBase.optional() }),
				z.object({ _type: z.literal("c"), x: z.number() }),
			]),
		);
		type Schema = z.infer<typeof schema>;
		type SchemaJson = Jsonify<Schema>;

		it("should validate", () => {
			for (const [toParse, expected] of [
				[{ _type: "a", a: "2000-01-01T00:00:00.000Z" }, true],
				[{ _type: "b", n: { c: "2000-01-01T00:00:00.000Z" } }, true],
				[{ _type: "c", x: 0 }, true],
				[{ _type: "a", a: null as unknown as string }, false],
			] satisfies Array<[SchemaJson, boolean]>) {
				expect(schema.safeParse(toParse).success).toBe(expected);
			}
		});

		it("should transform", () => {
			expect(
				schema.parse({
					_type: "b",
					n: { c: "2010-01-01T00:00:00.000Z" },
				} satisfies SchemaJson),
			).toStrictEqual({
				_type: "b",
				n: { c: new Date(2010, 0) },
			} satisfies Schema);
		});

		it("should be ok with nested discrimination", () => {
			const schema = objectForJson(
				z
					.object({
						a: z.number(),
						n0: z
							.discriminatedUnion("_type", [
								z.object({
									_type: z.literal("a"),
									c: z.date(),
								}),
								z.object({
									_type: z.literal("b"),
									n1: z.discriminatedUnion("_type", [
										z.object({ _type: z.literal("a") }),
										z.object({ _type: z.literal("b") }),
									]),
								}),
							])
							.optional(),
					})
					.partial(),
			);

			type Schema = z.infer<typeof schema>;
			type SchemaJson = Jsonify<Schema>;

			for (const [toParse, expected] of [
				[{ a: 0 }, true],
				[{ n0: { _type: "a", c: "2000-01-01T00:00:00.000Z" } }, true],
				[{ n0: { _type: "b", n1: { _type: "a" } } }, true],
				[{ n0: { _type: "b", n1: { _type: 0 as never } } }, false],
			] satisfies Array<[SchemaJson, boolean]>) {
				expect(schema.safeParse(toParse).success).toBe(expected);
			}
		});
	});
});
