import { jsonify } from "./jsonify";

describe("jsonify", () => {
	it("should jsonify", () => {
		const date = new Date();
		expect(jsonify({ a: 1, b: "2", c: date })).toStrictEqual({
			a: 1,
			b: "2",
			c: date.toISOString(),
		});
	});
});
