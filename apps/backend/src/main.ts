import { Logger } from "@nestjs/common";
import { NestFactory, repl } from "@nestjs/core";

import { AppModule } from "./app/app.module";
import { bootstrap } from "./bootstrap";
import { ENVIRONMENT } from "./configuration/environments";

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
	// Enabled if `--repl` appears in the arguments
	const isREPL = process.argv.slice(1).includes("--repl");

	const module = AppModule.forRoot({
		app: { name: APP_NAME, version: APP_VERSION },
		orm: { allowGlobalContext: isREPL },
	});

	if (isREPL) {
		await repl(module, { prompt: `REPL[${APP_NAME}@v${APP_VERSION}]> ` });
		return;
	}

	const { logger } = ENVIRONMENT;
	const [app, { host }] = await NestFactory.create(
		module,
		logger === "pino"
			? { bufferLogs: true }
			: logger === true
				? {} // All logs
				: { logger },
	).then(app => bootstrap(app));

	await app.listen(host.port, host.name);
	Logger.debug(
		`🚀 Application[${APP_NAME} - ${APP_VERSION}] is running on: ${await app.getUrl()}`,
	);
})();
