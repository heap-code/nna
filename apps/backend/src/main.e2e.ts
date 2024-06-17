import { MikroORM } from "@mikro-orm/core";
import { SeedManager } from "@mikro-orm/seeder";
import {
	Controller,
	HttpCode,
	HttpStatus,
	LogLevel,
	Logger,
	Module,
	OnModuleInit,
	Post,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as z from "zod";

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

	@Controller("_e2e_")
	class AppE2eController {
		public constructor(private readonly orm: MikroORM) {}

		@HttpCode(HttpStatus.NO_CONTENT)
		@Post("db/refresh")
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
			// Make the seeder object available
			SeedManager.register(this.orm);
		}
	}

	const baseApp = await NestFactory.create(AppE2eModule, { logger });
	const [app, { host }] = bootstrap(baseApp);

	await app.listen(host.port, host.name);
	Logger.debug(
		`💉 App-e2e 🧪 [${APP_NAME} - v${APP_VERSION}] is running on: ${await app.getUrl()}`,
	);
})();
