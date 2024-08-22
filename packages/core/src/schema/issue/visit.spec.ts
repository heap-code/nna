import { Issue, visit, VisitResultVisited, visitWithDefault } from "./visit";

describe("Issue Visit", () => {
	it("should visit", () => {
		const value = Math.random();
		const result = visitWithDefault(
			{ code: "invalid_date", path: [] },
			() => -10,
			{ invalid_date: () => value },
		);

		expect(result).toBe(value);
	});

	it("should use the default handler", () => {
		const value = Math.random();
		const result = visitWithDefault(
			{ code: "custom", path: [] },
			() => value,
			{},
		);
		expect(result).toBe(value);
	});

	it("should visit the issue (with issue type)", () => {
		const issue: Issue = {
			code: "invalid_string",
			path: [],
			validation: "email",
		};
		const { data, visited } = visit(issue, {
			[issue.code]: i => i.validation,
		}) as VisitResultVisited<typeof issue.validation>;

		expect(visited).toBe(true);
		expect(data).toBe(issue.validation);
	});
});
