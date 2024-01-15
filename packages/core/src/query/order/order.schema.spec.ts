import * as z from "zod";

import { Order as QueryOrder } from "./order";
import { OrderValue } from "./order-value";
import * as Order from "./order.schema";

const schemaFlat = z.object({
	boolean: z.boolean(),
	date: z.date(),
	enumZod: z.enum(["a", "b", "c"]),
	number: z.number().nullable(),
	string: z.string(),
});
type SchemaFlat = z.infer<typeof schemaFlat>;

describe("Order schema", () => {
	describe("With flat objects", () => {
		const orderSchema = Order.order(schemaFlat, { strict: true });

		it("should be valid", () => {
			const orders: Array<QueryOrder<SchemaFlat>> = [
				{},
				{ boolean: "asc_nf", date: "asc" },
				{ enumZod: "asc_nl" },
				{ number: "desc", string: "desc_nf" },
			];

			for (const order of orders) {
				expect(orderSchema.safeParse(order).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const orders: Array<[QueryOrder<SchemaFlat>, number]> = [
				[{ boolean: "abc" as OrderValue }, 1],
				[{ number: false as unknown as OrderValue }, 1],
				[{ abc: "asc" } as unknown as QueryOrder<SchemaFlat>, 1],
			];

			for (const [order, nError] of orders) {
				const result = orderSchema.safeParse(
					order,
				) as z.SafeParseError<never>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});

		it("should remove extraneous values (non-strict)", () => {
			const orders: Array<QueryOrder<SchemaFlat>> = [
				{ boolean: "asc_nf", date: "asc" },
				{ enumZod: "asc_nl" },
				{ number: "desc", string: "desc_nf" },
			];

			for (const order of orders) {
				const results = orderSchema.safeParse(
					order,
				) as z.SafeParseSuccess<never>;
				expect(results.success).toBe(true);
				expect(results.data).toStrictEqual(order);
			}
		});
	});

	describe("With nested objects", () => {
		const schemaNested = z.object({
			child: schemaFlat,
			children: z.array(schemaFlat),
			nest: z.object({ child: schemaFlat }),
			unknown: z.array(z.custom()),
		});
		type SchemaNested = z.infer<typeof schemaNested>;

		const orderSchema = Order.order(schemaFlat, { strict: true });

		it("should be valid", () => {
			const orders: Array<QueryOrder<SchemaNested>> = [
				{ child: { boolean: "asc" }, children: { number: "desc" } },
				{ nest: { child: { date: "asc_nf" } }, unknown: {} },
			];

			for (const order of orders) {
				expect(orderSchema.safeParse(order).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const orders: Array<[QueryOrder<SchemaNested>, number]> = [
				[
					{
						nest: {
							child: { date: "abc" as unknown as OrderValue },
						},
					},
					1,
				],
				[
					{
						children: [{ date: "asc" }],
						nest: "asc",
					} as unknown as never,
					2,
				],
			];

			for (const [order, nError] of orders) {
				const result = orderSchema.safeParse(
					order,
				) as z.SafeParseError<never>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});
	});

	describe("With discriminated union", () => {
		const schemaDiscriminated = z.discriminatedUnion("type", [
			z.object({ date: z.date().nullable(), type: z.literal("idle") }),
			z.object({ data: z.string(), type: z.literal("success") }),
			z.object({ code: z.number(), type: z.literal("error") }),
		]);

		const schemaWithDiscrimination = z.object({
			child: z.object({
				discriminated: schemaDiscriminated,
				number: z.number(),
			}),
			discriminated: schemaDiscriminated,
		});
		type SchemaWithDiscrimination = z.infer<
			typeof schemaWithDiscrimination
		>;
		const orderSchema = Order.order(schemaWithDiscrimination, {
			strict: true,
		});

		it("should be valid", () => {
			const orders: Array<QueryOrder<SchemaWithDiscrimination>> = [
				{ discriminated: { type: "asc" } },
				{
					child: {
						discriminated: { type: "desc" },
						number: "desc_nl",
					},
				},
				{ discriminated: { code: "asc", date: "desc" } },
			];

			for (const order of orders) {
				expect(orderSchema.safeParse(order).success).toBe(true);
			}
		});

		it("should not be valid", () => {
			const orders: Array<
				[QueryOrder<SchemaWithDiscrimination>, number]
			> = [
				[
					{ discriminated: { code: "abc" as unknown as OrderValue } },
					1,
				],
				[{ discriminated: { abc: "desc" } as unknown as never }, 1],
			];

			for (const [order, nError] of orders) {
				const result = orderSchema.safeParse(
					order,
				) as z.SafeParseError<never>;

				expect(result.success).toBe(false);
				expect(result.error.errors).toHaveLength(nError);
			}
		});
	});
});
