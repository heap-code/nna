import { extractModulesFromRoutes } from "./routes";

describe("Routes", () => {
	/* eslint-disable @typescript-eslint/no-extraneous-class -- For test */
	class A {}
	class B {}
	class C {}
	class D {}
	class E {}
	/* eslint-enable */

	describe("extractModulesFromRoutes", () => {
		it("should extract correctly", () => {
			expect(
				extractModulesFromRoutes([
					{ module: A, path: "" },
					{
						children: [C, { children: [D], path: "" }],
						module: B,
						path: "",
					},
					{
						children: [{ children: [E], path: "" }],
						module: A,
						path: "",
					},
				]),
			).toStrictEqual(new Set([A, B, C, D, E]));
		});
	});
});
