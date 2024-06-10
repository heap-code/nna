import {
	Body,
	Controller,
	Get,
	INestApplication,
	Post,
	Query,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Schemas, utils } from "@nna/core";
import supertest from "supertest";
import * as z from "zod";

import { PayloadValidationPipe, createPayload } from "./payload";

describe("Payload", () => {
	const schema = Schemas.objectForJson(
		z.object({ d: z.date(), n: z.coerce.number().min(1) }),
	);
	type Schema = z.infer<typeof schema>;

	class Body1 extends createPayload(schema) {}
	class Body2 extends createPayload(schema.strict()) {}
	class Query1 extends createPayload(schema) {}

	@Controller()
	class TestController {
		@Get()
		public get(@Query() query: Query1) {
			return query;
		}
		@Post("1")
		public post1(@Body() body: Body1) {
			return body;
		}
		@Post("2")
		public post2(@Body() body: Body2) {
			return body;
		}
	}

	let app: INestApplication;
	let request: supertest.Agent;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [TestController],
		}).compile();
		app = await module
			.createNestApplication()
			.useGlobalPipes(new PayloadValidationPipe())
			.init();
		request = supertest(app.getHttpServer() as never);
	});

	afterAll(() => app.close());

	const invalidPayloads = [
		{},
		{ n: 10 },
		{ d: new Date() },
		{ d: new Date(), n: -10 },
		{ d: "A date" as unknown as Date, n: 10 },
	] satisfies Array<Partial<Schema>>;

	it("should work with @Query", async () => {
		for (const query of invalidPayloads) {
			await request.get("/").query(query).expect(400);
		}

		const now = new Date();
		const query = { d: now, n: 10 } satisfies Schema;

		const res1 = await request.get("/").query(query);
		expect(res1.body).toStrictEqual(utils.jsonify(query));

		// Schema is by default in strip
		const res2 = await request.get("/").query({ ...query, _z: 0 });
		expect(res2.body).toStrictEqual(utils.jsonify(query));
	});

	it("should work with @Body", async () => {
		const now = new Date();
		const body = { d: now, n: 10 } satisfies Schema;

		for (const path of ["/1", "/2"]) {
			for (const query of invalidPayloads) {
				await request.post(path).send(query).expect(400);
			}

			const res = await request.post(path).send(body);
			expect(res.body).toStrictEqual(utils.jsonify(body));
		}

		const body2 = { ...body, _z: 0 };

		const res = await request.post("/1").send(body2);
		expect(res.body).toStrictEqual(utils.jsonify(body));

		await request.post("/2").send(body2).expect(400);
	});
});
