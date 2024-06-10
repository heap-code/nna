import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app/app.module";
import { bootstrap } from "./bootstrap";
import { ENVIRONMENT } from "./configuration/environments";

// Injected from webpack. These are no variables, but "MACROs".
/** @internal */
declare const __APP_NAME__: string;
/** @internal */
declare const __APP_VERSION__: string;

void (async () => {
	const [app, { APP_NAME, APP_VERSION, host }] = await NestFactory.create(
		AppModule.forRoot({
			app: { name: __APP_NAME__, version: __APP_VERSION__ },
		}),
		ENVIRONMENT.logger === "pino"
			? { bufferLogs: true }
			: ENVIRONMENT.logger === true
				? {} // All logs
				: { logger: ENVIRONMENT.logger },
	).then(app => bootstrap(app));

	await app.listen(host.port, host.name);
	Logger.debug(
		`🚀 Application[${APP_NAME} - v${APP_VERSION}] is running on: ${await app.getUrl()}`,
	);
})();
