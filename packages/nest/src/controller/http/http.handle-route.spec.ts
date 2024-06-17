import { Controller, INestApplication, Param } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { HttpRoute } from "@nna/core";
import supertest from "supertest";

import { HttpHandleRoute } from "./http.handle-route";
import { ControllerFor } from "../controller-for";
import { PayloadValidationPipe, createPayload } from "../payload/payload";

describe("HttpHandleRoute", () => {
	const routes = {
		get: HttpRoute.builder("simple/path").get<() => string[]>(),
		put: HttpRoute.builder([
			{ path: "a", type: "path" },
			{ param: "id", type: "param", validation: "number" },
			{ path: "b", type: "path" },
			{ param: "gId", type: "param", validation: "string" },
		]).put(),
	} satisfies HttpRoute.Definitions;
	type HttpRoutes = HttpRoute.Handlers<typeof routes>;

	class BParam extends createPayload(routes.put.getParamSchema()) {}

	@Controller()
	class TestController implements ControllerFor<HttpRoutes> {
		@HttpHandleRoute(routes.get)
		public get() {
			return ["a"];
		}

		@HttpHandleRoute(routes.put)
		public put(@Param() params: BParam) {
			return params;
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

	it("should work without parameters", async () => {
		await request.get(`/api/${routes.get.path({})}`).expect(404);

		const res = await request.get(routes.get.path({})).expect(200);
		expect(res.body).toStrictEqual(["a"]);
	});

	it("should work with parameters", async () => {
		await request
			.put(routes.put.path({ gId: "gId", id: "a" as never as number }))
			.expect(400);

		const params: HttpRoute.ExtractDefinitionParams<typeof routes.put> = {
			gId: "gId",
			id: 10,
		};

		const res = await request.put(routes.put.path(params)).expect(200);
		expect(res.body).toStrictEqual(params);
	});
});
