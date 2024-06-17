import * as z from "zod";

import { createQueryResultsSchema } from "./query-results.schema";
import { Schemas } from "..";
import { jsonify } from "../utils";

describe("createQueryResultsSchema", () => {
	const base = z.object({ a: z.number(), b: z.string(), c: z.date() });
	const schema = createQueryResultsSchema(base);
	type Schema = z.infer<typeof schema>;

	it("should parse", () => {
		const data: Schema = {
			data: [{ a: 1, b: "a", c: new Date() }],
			pagination: { range: { end: 1, start: 0 }, total: 10 },
		};
		expect(schema.parse(data)).toStrictEqual(data);
	});

	it("should parse JSON content", () => {
		const data: Schema = {
			data: [{ a: 1, b: "a", c: new Date() }],
			pagination: { range: { end: 1, start: 0 }, total: 10 },
		};
		expect(
			Schemas.objectForJson(schema).parse(jsonify(data)),
		).toStrictEqual(data);
	});
});
