import { QueryOrder } from "@mikro-orm/core";
import { QueryOrderValue } from "@nna/core";

import { OrderValue, fromQueryOrderValue } from "./order-value";

describe("EntityQueryOrderValue", () => {
	it("should convert from QueryOrderValue", () => {
		for (const [from, to] of [
			["asc", QueryOrder.ASC],
			["asc_nf", QueryOrder.ASC_NULLS_FIRST],
			["asc_nl", QueryOrder.ASC_NULLS_LAST],
			["desc", QueryOrder.DESC],
			["desc_nf", QueryOrder.DESC_NULLS_FIRST],
			["desc_nl", QueryOrder.DESC_NULLS_LAST],
		] satisfies Array<[QueryOrderValue, OrderValue]>) {
			expect(fromQueryOrderValue(from)).toBe(to);
		}
	});
});
