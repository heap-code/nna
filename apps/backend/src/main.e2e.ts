import { MikroORM } from "@mikro-orm/core";
import { SeedManager } from "@mikro-orm/seeder";
import {
	Body,
	Controller,
	LogLevel,
	Logger,
	Module,
	OnModuleInit,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ControllerFor, HttpHandleRoute, createPayload } from "@nna/nest";
import * as z from "zod";
import { E2eHttp } from "~/testing/e2e";
import { SeedGenerator } from "~/testing/seeds";

import { AppModule } from "./app/app.module";
import { bootstrap } from "./bootstrap";
import { OrmTesting } from "../test";

// Injected from webpack. These are no variables, but "MACROs".
/** @internal */
declare const __APP_NAME__: string;
/** @internal */
declare const __APP_VERSION__: string;

/** @internal */
const APP_NAME = __APP_NAME__;
/** @internal */
const APP_VERSION = __APP_VERSION__;

void (async () => {
	const logger: LogLevel[] = ["debug", "error", "fatal"];

	class RefreshDbPayload extends createPayload(
		SeedGenerator.generateParameterSchema,
	) {}

	@Controller(E2eHttp.CONFIG.entrypoint)
	class AppE2eController implements ControllerFor<E2eHttp.Http> {
		public constructor(private readonly orm: OrmTesting.DataSeeder) {}

		@HttpHandleRoute(E2eHttp.CONFIG.routes.refreshDb)
		public refreshDb(@Body() body: RefreshDbPayload) {
			return this.orm.generate(body);
		}
	}

	@Module({
		controllers: [AppE2eController],
		imports: [
			AppModule.forRoot({
				app: { name: APP_NAME, version: `${APP_VERSION}-e2e` },
				auth: {
					cookie: { name: "e2e-cookie", secure: false },
					duration: 10 * 60,
					secret: "e2e-secret",
				},
				host: {
					cors: {
						origin: [
							/\/\/127.0.0.\d{1,3}/,
							/\/\/localhost(:\d{1,5})?/,
						],
					},
					globalPrefix: "e2e/api",
					name: "127.0.0.1",
					port: 33000,
				},
				logger,
				orm: {
					applyMigrations: false,
					dbName: z
						.string()
						.min(1)
						.default("db-e2e")
						.parse(process.env.BE_DB_TEST_NAME),
				},
			}),
		],
		// Only for e2e
		providers: [OrmTesting.DataSeeder],
	})
	class AppE2eModule implements OnModuleInit {
		public constructor(private readonly orm: MikroORM) {}
		public onModuleInit() {
			// Make the seeder object available (without setting it in the configuration)
			SeedManager.register(this.orm);
		}
	}

	const [app, { host }] = bootstrap(
		await NestFactory.create(AppE2eModule, { logger }),
	);

	await app.listen(host.port, host.name);
	Logger.debug(
		`💉 App-e2e 🧪 [${APP_NAME} - v${APP_VERSION}] is running on: ${await app.getUrl()}`,
	);
})();
