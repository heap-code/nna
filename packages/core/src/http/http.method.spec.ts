import { HTTP_METHODS, isHttpMethod } from "./http.method";

describe("HTTP methods", () => {
	describe("`isHttpMethod`", () => {
		it("should return that a string is a HTTP method", () => {
			for (const method of HTTP_METHODS) {
				expect(isHttpMethod(method)).toBe(true);
			}
		});

		it("should return that a string is not a HTTP method", () => {
			for (const method of ["gE", 0, {}, Date.now()]) {
				expect(isHttpMethod(method)).toBe(false);
			}
		});
	});
});
