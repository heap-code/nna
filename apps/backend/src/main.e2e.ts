import { LogLevel, Logger } from "@nestjs/common";
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
	const [app, { host }] = await NestFactory.create(
		AppModule.forRoot({
			app: { name: APP_NAME, version: `${APP_VERSION}-e2e` },
			auth: {
				cookie: { name: "e2e-cookie" },
				duration: 10 * 60,
				secret: "e2e-secret",
			},
			host: {
				cors: { origin: /\/\/localhost(:\d{1,5})+/ },
				globalPrefix: "/e2e/api",
				name: "127.0.0.1",
				port: 33000,
			},
			logger,
			orm: {
				dbName: z
					.string()
					.min(1)
					.default("db-e2e")
					.parse(process.env.BE_DB_TEST_NAME),
			},
			swagger: false,
		}),
		{ logger },
	).then(app => bootstrap(app));

	// TODO: inject DB managers routes

	await app.listen(host.port, host.name);
	Logger.debug(
		`💉 App-e2e 🧪 [${APP_NAME} - v${APP_VERSION}] is running on: ${await app.getUrl()}`,
	);
})();
