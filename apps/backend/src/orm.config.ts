import { MikroORM } from "@mikro-orm/core";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app/app.module";

/**
 * This exposes the configuration for `mikro-orm` CLI
 *
 * @returns the `mikro-orm` CLI configuration
 */
export default async () => {
	// The `MikroOrmModule` constructs all the configuration with auto-loaded entities.
	const app = await NestFactory.createApplicationContext(
		AppModule.forRoot({ orm: { connect: false } }),
		{
			logger: ["debug", "error", "fatal"],
		},
	);

	const orm = app.get(MikroORM);

	// Let be sure to close the app (even if it is not supposed to run until the `listen` call)
	await app.close();
	return orm.config.getAll();
};
