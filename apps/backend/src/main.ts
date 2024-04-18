import { ZodValidationPipe } from "@anatine/zod-nestjs";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

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
		ENVIRONMENT.logger === true ? {} : { logger: ENVIRONMENT.logger },
	);
	const configService = app.get(ConfigurationService);
	const { host, logger, swagger } = configService.configuration;

	if (logger !== true) {
		app.useLogger(logger);
	}

	app.setGlobalPrefix(host.globalPrefix)
		.useGlobalPipes(new ZodValidationPipe())
		.enableShutdownHooks()
		.enableCors({ ...host.cors });

	if (swagger) {
		const options = new DocumentBuilder()
			.setTitle(`${configService.APP_NAME} API`)
			.setVersion(configService.APP_VERSION)
			.build();
		const document = SwaggerModule.createDocument(app, options);
		SwaggerModule.setup(`/${host.globalPrefix}`, app, document);
	}

	await app.listen(host.port, host.name);
	Logger.debug(`🚀 Application is running on: ${await app.getUrl()}`);
})();
