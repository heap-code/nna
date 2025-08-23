import { Issue, visit, VisitResultVisited, visitWithFallback } from "./visit";

describe("Issue Visit", () => {
	it("should visit", () => {
		const value = Math.random();
		const result = visitWithFallback(
			{
				code: "invalid_value",
				message: "",
				path: [],
				values: [],
			},
			() => -10,
			{ invalid_value: () => value },
		);

		expect(result).toBe(value);
	});

	it("should use the fallback", () => {
		const value = Math.random();
		const result = visitWithFallback(
			{ code: "custom", message: "", path: [] },
			() => value,
			{},
		);
		expect(result).toBe(value);
	});

	it("should visit the issue (with issue type)", () => {
		const issue: Issue = {
			code: "too_big",
			maximum: 100,
			message: "",
			origin: "number",
			path: [],
		};
		const { data, visited } = visit(issue, {
			[issue.code]: i => i.maximum,
		}) as VisitResultVisited<typeof issue.maximum>;

		expect(visited).toBe(true);
		expect(data).toBe(issue.maximum);
	});
});
