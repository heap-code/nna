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
	const dateString = "2010-01-01T00:00:00.000Z";
	const dateDate = new Date(Date.UTC(2010, 0));

	it("should not modify the schema when there is no need", () => {
		const schema = schemaBase.pick({ a: true, b: true });
		expect(objectForJson(schema)).toBe(schema);
	});

	describe("On flat objects", () => {
		const schema = objectForJson(schemaBase);
		type Schema = z.input<typeof schema>;
		type SchemaJson = Jsonify<Schema>;

		it("should validate", () => {
			for (const [toParse, expected] of [
				[{}, true],
				[{ a: 0, b: "ab" }, true],
				[{ c: "2000-01-01T12:00:00.000Z", d: null }, true],
				[{ c: new Date() as never as string }, true],
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
					c: dateString,
				} satisfies SchemaJson),
			).toStrictEqual({
				a: 10,
				c: dateDate,
			} satisfies Schema);
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
					n: { c: dateString },
				} satisfies SchemaJson),
			).toStrictEqual({
				b: "10",
				n: { c: dateDate },
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
				[{ c: dateString, ns: [1] }, true],
				[{ array: [{ c: dateString }] }, true],
				[{ array: [{}, {}, {}] }, false],
			] satisfies Array<[SchemaJson, boolean]>) {
				expect(schema.safeParse(toParse).success).toBe(expected);
			}
		});

		it("should transform", () => {
			expect(
				schema.parse({
					array: [{ c: dateString }],
					b: "10",
				} satisfies SchemaJson),
			).toStrictEqual({
				array: [{ c: dateDate }],
				b: "10",
			} satisfies Schema);
		});
	});

	describe("With default", () => {
		const schema = objectForJson(
			z.object({
				a: z.date().optional(),
				b: z.date().default(dateDate),
				c: z.number().default(0),
			}),
		);
		type Schema = z.infer<typeof schema>;
		type SchemaJson = Jsonify<z.input<typeof schema>>;

		it("should validate", () => {
			for (const [toParse, expected] of [
				[{}, true],
				[{ a: dateString, b: dateString }, true],
			] satisfies Array<[SchemaJson, boolean]>) {
				expect(schema.safeParse(toParse).success).toBe(expected);
			}
		});

		it("should transform", () => {
			expect(
				schema.parse({ a: dateString } satisfies SchemaJson),
			).toStrictEqual({
				a: dateDate,
				b: dateDate,
				c: 0,
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
					n: { c: dateString },
				} satisfies SchemaJson),
			).toStrictEqual({
				b: "10",
				n: { c: dateDate },
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
					n: { c: dateString },
				} satisfies SchemaJson),
			).toStrictEqual({
				_type: "b",
				n: { c: dateDate },
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
