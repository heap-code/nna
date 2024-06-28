import { MikroORM } from "@mikro-orm/core";
import { SeedManager } from "@mikro-orm/seeder";
import {
	Controller,
	LogLevel,
	Logger,
	Module,
	OnModuleInit,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ControllerFor, HttpHandleRoute } from "@nna/nest";
import * as z from "zod";
import { E2E_HTTP_CONFIG, E2eHttp } from "~/testing/e2e";

import { AppModule } from "./app/app.module";
import { bootstrap } from "./bootstrap";

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

	@Controller(E2E_HTTP_CONFIG.entrypoint)
	class AppE2eController implements ControllerFor<E2eHttp> {
		public constructor(private readonly orm: MikroORM) {}

		@HttpHandleRoute(E2E_HTTP_CONFIG.routes.refreshDb)
		public async refreshDb() {
			// TODO
			await this.orm.seeder.seed("TODO" as never);
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
