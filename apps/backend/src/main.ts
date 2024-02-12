import { ZodValidationPipe } from "@anatine/zod-nestjs";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app/app.module";
import { ConfigurationService } from "./configuration";
import { ENVIRONMENT } from "./configuration/environments";

void (async () => {
	const app = await NestFactory.create(
		AppModule.forRoot(),
		ENVIRONMENT.logger === true ? {} : { logger: ENVIRONMENT.logger },
	);
	const { host, logger, swagger } =
		app.get(ConfigurationService).configuration;

	if (logger !== true) {
		app.useLogger(logger);
	}

	app.setGlobalPrefix(host.globalPrefix)
		.useGlobalPipes(new ZodValidationPipe())
		.enableShutdownHooks()
		.enableCors({ ...host.cors });

	if (swagger) {
		const options = new DocumentBuilder().build();
		const document = SwaggerModule.createDocument(app, options);
		SwaggerModule.setup(`/${host.globalPrefix}`, app, document);
	}

	await app.listen(host.port, host.name);
	Logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
})();
