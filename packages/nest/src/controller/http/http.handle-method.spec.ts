import { Controller, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { HttpMethod } from "@nna/core";
import supertest from "supertest";

import { HttpHandleMethod } from "./http.handle-method";

describe("HttpHandleMethod", () => {
	@Controller()
	class TestController {
		@HttpHandleMethod("GET")
		public get() {
			return ["GET"];
		}
		@HttpHandleMethod("GET", "get")
		public get2() {
			return ["GET"];
		}
		@HttpHandleMethod("POST")
		public post() {
			return ["POST"];
		}
		@HttpHandleMethod("PATCH")
		public patch() {
			return ["PATCH"];
		}
		@HttpHandleMethod("PUT")
		public put() {
			return ["PUT"];
		}
		@HttpHandleMethod("DELETE")
		public delete() {
			return ["DELETE"];
		}
	}

	let app: INestApplication;
	let request: supertest.Agent;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [TestController],
		}).compile();
		app = await module.createNestApplication().init();
		request = supertest(app.getHttpServer() as never);
	});

	afterAll(() => app.close());

	it("should apply the correct handler", async () => {
		for (const [method, fn] of [
			["GET", () => request.get("/")],
			["POST", () => request.post("/")],
			["PATCH", () => request.patch("/")],
			["PUT", () => request.put("/")],
			["DELETE", () => request.delete("/")],
			["GET", () => request.get("/get")],
		] satisfies Array<[HttpMethod, () => Promise<unknown>]>) {
			const res = await fn();
			expect(res.body).toStrictEqual([method]);
		}
	});
});
