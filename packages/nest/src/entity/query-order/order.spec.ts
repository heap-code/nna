import { QueryOrder } from "@mikro-orm/core";

import { fromQueryOrder } from "./order";
import { OrderValue } from "./order-value";

enum EnumTest {
	A = 1,
	B = 2,
	C = 3,
}
interface EntityTest {
	a: number;
	b: string;
	object: { c: EnumTest };
	relation: { d: number } | null;
}

describe("EntityQueryOrder", () => {
	describe("Conversion from QueryOrder", () => {
		it("should convert (1)", () => {
			const decoded = fromQueryOrder<EntityTest>({
				a: "asc",
				object: { c: "desc" },
			});

			expect(decoded.b).toBeUndefined();
			expect(decoded.relation).toBeUndefined();

			expect(decoded.a).toBe(QueryOrder.ASC satisfies OrderValue);
			expect(decoded.object?.c).toBe(
				QueryOrder.DESC satisfies OrderValue,
			);
		});

		it("should convert (with nullable object)", () => {
			// More of a type test
			const decoded = fromQueryOrder<EntityTest>({
				b: "desc_nf",
				relation: { d: "asc_nl" },
			});

			expect(decoded.a).toBeUndefined();
			expect(decoded.object).toBeUndefined();

			expect(decoded.b).toBe(
				QueryOrder.DESC_NULLS_FIRST satisfies OrderValue,
			);
			expect(decoded.relation?.d).toBe(
				QueryOrder.ASC_NULLS_LAST satisfies OrderValue,
			);
		});
	});
});
