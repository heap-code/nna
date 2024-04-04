import { ORDER_VALUES } from "./order-value";
import { orderValue } from "./order-value.schema";

describe("OrderValue schema", () => {
	it("should be valid", () => {
		for (const value of ORDER_VALUES) {
			expect(orderValue.safeParse(value).success).toBe(true);
		}
	});

	it("should not be valid", () => {
		for (const value of ["a", 1, {}]) {
			expect(orderValue.safeParse(value).success).toBe(false);
		}
	});
});
