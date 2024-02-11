import { ZodValidationPipe } from "@anatine/zod-nestjs";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app/app.module";

void (async () => {
	const app = await NestFactory.create(AppModule);
	const globalPrefix = "api";
	app.setGlobalPrefix(globalPrefix).useGlobalPipes(new ZodValidationPipe());

	const options = new DocumentBuilder().build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup("/api", app, document);

	const port = process.env.PORT || 3000;
	await app.listen(port, "127.0.0.1");
	Logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
})();
