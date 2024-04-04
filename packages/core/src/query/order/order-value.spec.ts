import {
	isOrderValue,
	OrderValue,
	isOrderValueDesc,
	OrderValueDesc,
	OrderValueAsc,
	isOrderValueAsc,
} from "./order-value";

describe("OrderValue", () => {
	it("should determine an OrderValue", () => {
		for (const order of [
			"asc",
			"asc_nf",
			"asc_nl",
			"desc",
			"desc_nf",
			"desc_nl",
		] satisfies OrderValue[]) {
			expect(isOrderValue(order)).toBe(true);
		}

		for (const order of ["abc", 1, {}]) {
			expect(isOrderValue(order)).toBe(false);
		}
	});

	it("should determine an `ASC` order", () => {
		for (const order of [
			"asc",
			"asc_nf",
			"asc_nl",
		] satisfies OrderValueAsc[]) {
			expect(isOrderValueAsc(order)).toBe(true);
		}

		for (const order of [
			"desc",
			"desc_nf",
			"desc_nl",
		] satisfies OrderValueDesc[]) {
			expect(isOrderValueAsc(order)).toBe(false);
		}
	});

	it("should determine an `DESC` order", () => {
		for (const order of [
			"asc",
			"asc_nf",
			"asc_nl",
		] satisfies OrderValueAsc[]) {
			expect(isOrderValueDesc(order)).toBe(false);
		}

		for (const order of [
			"desc",
			"desc_nf",
			"desc_nl",
		] satisfies OrderValueDesc[]) {
			expect(isOrderValueDesc(order)).toBe(true);
		}
	});
});
