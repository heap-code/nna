import {
	Entity,
	ForeignKeyConstraintViolationException,
	NotFoundError,
	UniqueConstraintViolationException,
} from "@mikro-orm/core";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { Controller, Get, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";

import { OrmModule } from "./orm.module";
import { EntityNumber } from "../entity/entities";

@Entity()
class AnEntity extends EntityNumber.Entity() {}

const URLs = {
	FOREIGN_KEY: "/foreign-key",
	NOT_FOUND: "/not-found",
	UNIQUE_CONSTRAINT: "/unique-constraint",
} as const;

@Controller()
class AController {
	@Get(URLs.FOREIGN_KEY)
	public foreignKey() {
		throw new ForeignKeyConstraintViolationException(new Error("TEST"));
	}
	@Get(URLs.NOT_FOUND)
	public notFound() {
		throw new NotFoundError("TEST");
	}
	@Get(URLs.UNIQUE_CONSTRAINT)
	public uniqueConstraint() {
		throw new UniqueConstraintViolationException(new Error("TEST"));
	}
}

describe("ORM Filters", () => {
	let app: INestApplication;
	let request: supertest.Agent;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [AController],
			imports: [
				OrmModule.forRoot({
					orm: {
						connect: false,
						dbName: ":memory:",
						driver: SqliteDriver,
						entities: [AnEntity],
					},
				}),
			],
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();

		request = supertest(app.getHttpServer() as never);
	});

	afterAll(() => app.close());

	/* eslint-disable jest/expect-expect -- integrated in `supertest` */

	it("should return a 404 code for an ORM foreign-key error", () =>
		request.get(URLs.FOREIGN_KEY).expect(404));

	it("should return a 404 code for an ORM not-found error", () =>
		request.get(URLs.NOT_FOUND).expect(404));

	it("should return a 409 code for an ORM unique-constraint error", () =>
		request.get(URLs.UNIQUE_CONSTRAINT).expect(409));

	/* eslint-enable */
});
