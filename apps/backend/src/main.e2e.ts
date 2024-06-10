import { LogLevel, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app/app.module";
import { bootstrap } from "./bootstrap";

// Injected from webpack. These are no variables, but "MACROs".
/** @internal */
declare const __APP_NAME__: string;
/** @internal */
declare const __APP_VERSION__: string;

void (async () => {
	const logger: LogLevel[] = ["debug", "error", "fatal"];
	const [app, { APP_NAME, APP_VERSION, host }] = await NestFactory.create(
		AppModule.forRoot({
			app: { name: __APP_NAME__, version: `${__APP_VERSION__}-e2e` },
			auth: {
				cookie: { name: "e2e-cookie" },
				duration: 30 * 60,
				secret: "e2e-secret",
			},
			logger,
			swagger: false,
		}),
		{ logger },
	).then(app => bootstrap(app));

	// TODO: inject DB managers routes

	await app.listen(host.port, host.name);
	Logger.debug(
		`🧪 E2E[${APP_NAME} - v${APP_VERSION}] is running on: ${await app.getUrl()}`,
	);
})();
