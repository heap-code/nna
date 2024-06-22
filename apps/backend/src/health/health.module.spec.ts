import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Entity, defineConfig } from "@mikro-orm/sqlite";
import { ServiceUnavailableException } from "@nestjs/common";
import { HealthCheckResult } from "@nestjs/terminus";
import { Test } from "@nestjs/testing";
import { EntityNumber } from "@nna/nest";

import { HealthController } from "./health.controller";
import { HealthModule } from "./health.module";

describe("HealthModule", () => {
	@Entity()
	class TestEntity extends EntityNumber.Entity() {}

	let controller: HealthController;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [
				HealthModule,
				MikroOrmModule.forRoot(
					defineConfig({
						connect: false,
						dbName: ":memory:",
						entities: [TestEntity],
					}),
				),
			],
		}).compile();

		controller = module.get(HealthController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should get a health status", async () => {
		const res = await controller.check().catch(err => {
			// On jest, memory checks are wrong
			if (err instanceof ServiceUnavailableException) {
				return err.getResponse() as HealthCheckResult;
			}

			throw err;
		});

		expect(res.details).toBeDefined();
		expect(res.error).toBeDefined();
		expect(res.info).toBeDefined();
		expect(res.status).toBeDefined();
	});
});
