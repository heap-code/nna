import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { PayloadValidationPipe } from "@nna/nest";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import * as Pino from "nestjs-pino";

import { ConfigurationService } from "./configuration";

/**
 * Bootstraps a Nest application by, mostly, adding Http middleware
 *
 * @param app to bootstrap (it should have a {@link ConfigurationService} provider)
 * @returns the Nest application (same as given one) and the configuration found
 */
export function bootstrap(app: INestApplication) {
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
		.use(helmet())
		.useGlobalPipes(new PayloadValidationPipe())
		.enableShutdownHooks()
		.enableCors({ ...host.cors, credentials: true });

	if (swagger) {
		const config = new DocumentBuilder()
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

		// Needed from the zod-nestjs and openAPI compatibility
		// https://github.com/anatine/zod-plugins/blob/main/packages/zod-nestjs/README.md#set-up-your-app
		//patchNestjsSwagger();

		const document = SwaggerModule.createDocument(app, {
			...config,
			// Needed from the zod-nestjs and openAPI compatibility
			openapi: "3.1.0",
		});

		for (const schema of Object.values(
			document.components?.schemas ?? {},
		)) {
			// https://github.com/BenLorantfy/nestjs-zod?tab=readme-ov-file#cleanupopenapidoc-ensure-proper-openapi-output
			// @ts-expect-error -- linked to https://github.com/BenLorantfy/nestjs-zod/issues/184?
			delete (schema.properties as { root: unknown })?.root;
		}
		SwaggerModule.setup(`/${host.globalPrefix}`, app, document);
	}

	return [app, configuration] as const;
}
