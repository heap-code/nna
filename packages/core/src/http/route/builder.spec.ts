import { builder } from "./builder";
import { AnyDefinition, ExtractDefinitionHandler } from "./definition";
import { HttpMethod } from "../http.method";

describe("HttpRouteBuilder", () => {
	const builderRoot = builder("/users");
	const builderById = builderRoot.addSegment({
		param: "id",
		type: "param",
		validation: "number",
	});

	const routeRoot = builderRoot.get<(body: string) => number>();
	const routeById = builderById.put<(body: string) => number>();

	it("should give correct types", () => {
		/* eslint-disable unused-imports/no-unused-vars -- Type checking only */
		const handlersRoot: Array<ExtractDefinitionHandler<typeof routeRoot>> =
			[
				(body: string) => 123,
				// @ts-expect-error -- wrong return type
				(body: string) => "123",
				// @ts-expect-error -- wrong param type
				(body: number) => 123,
				// @ts-expect-error -- Additional non-optional parameter
				(body: string, y: number) => 123,
			];
		const handlersById: Array<ExtractDefinitionHandler<typeof routeById>> =
			[
				(params: { id: number }, body: string) => 123,
				// @ts-expect-error -- wrong return type
				(params: { id: number }, body: string) => "123",
				// @ts-expect-error -- wrong param type
				(params: { id: string }, body: string) => 123,
				// @ts-expect-error -- missing param type
				(body: string) => 123,
			];
		/* eslint-enable */

		expect(handlersRoot).not.toHaveLength(0);
		expect(handlersById).not.toHaveLength(0);
	});

	it("should define the correct methods", () => {
		for (const [{ method }, expected] of [
			[builderRoot.get(), "GET"],
			[builderRoot.post(), "POST"],
			[builderRoot.patch(), "PATCH"],
			[builderRoot.put(), "PUT"],
			[builderRoot.delete(), "DELETE"],
		] satisfies Array<[AnyDefinition, HttpMethod]>) {
			expect(method).toBe(expected);
		}
	});

	it("should construct the paths", () => {
		expect(routeRoot.path({})).toBe("/users");
		expect(routeById.path({ id: 7 })).toBe("/users/7");

		expect(
			builder([{ path: "a/path", type: "path" }])
				.delete()
				.path({ id: 2 }),
		).toBe("/a/path");
	});

	it("should get the schemas", () => {
		const schemaRoot = routeRoot.getParamSchema();
		const schemaById = routeById.getParamSchema();

		expect(schemaRoot.parse({})).toStrictEqual({});
		expect(schemaById.parse({ id: "2" })).toStrictEqual({ id: 2 });
	});
});
