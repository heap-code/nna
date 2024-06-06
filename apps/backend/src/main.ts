import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { PayloadValidationPipe } from "@nna/nest";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import * as Pino from "nestjs-pino";

import { AppModule } from "./app/app.module";
import { ConfigurationService } from "./configuration";
import { ENVIRONMENT } from "./configuration/environments";

// Injected from webpack. These are no variables, but "MACROs".
/** @internal */
declare const __NPM_NAME__: string;
/** @internal */
declare const __NPM_VERSION__: string;

void (async () => {
	const app = await NestFactory.create(
		AppModule.forRoot({
			npm: { name: __NPM_NAME__, version: __NPM_VERSION__ },
		}),
		ENVIRONMENT.logger === "pino"
			? { bufferLogs: true }
			: ENVIRONMENT.logger === true
				? {} // All logs
				: { logger: ENVIRONMENT.logger },
	);

	const { APP_NAME, APP_VERSION, configuration } =
		app.get(ConfigurationService);
	const { auth, host, logger, swagger } = configuration;

	// Refine logger
	if (logger === "pino") {
		app.useLogger(app.get(Pino.Logger));
	} else if (logger !== true) {
		app.useLogger(logger);
	}

	app.setGlobalPrefix(host.globalPrefix)
		.use(cookieParser.default(auth.secret))
		.use(helmet({ contentSecurityPolicy: false }))
		.useGlobalPipes(new PayloadValidationPipe())
		.enableShutdownHooks()
		.enableCors({ ...host.cors });

	if (swagger) {
		const options = new DocumentBuilder()
			.addBearerAuth()
			.addCookieAuth(auth.cookie.name, {
				description:
					"As described <a href='https://swagger.io/docs/specification/authentication/cookie-authentication/' target='_blank' >here</a>, it does not work with the Swagger UI." +
					"<br>However, the <i>Curl</i> example works fine and the cookie itself is stored in the browser",
				type: "apiKey",
			})
			.setTitle(`${APP_NAME} API`)
			.setVersion(APP_VERSION)
			.build();
		const document = SwaggerModule.createDocument(app, options);
		SwaggerModule.setup(`/${host.globalPrefix}`, app, document);
	}

	await app.listen(host.port, host.name);
	Logger.debug(
		`🚀 Application[${APP_NAME} - v${APP_VERSION}] is running on: ${await app.getUrl()}`,
	);
})();
