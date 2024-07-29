import { MikroORM } from "@mikro-orm/core";
import { SeedManager } from "@mikro-orm/seeder";
import { NestFactory } from "@nestjs/core";
import { deepmerge } from "deepmerge-ts";

import { AppModule } from "./app/app.module";

/**
 * This exposes the configuration for `mikro-orm` CLI
 *
 * @returns the `mikro-orm` CLI configuration
 */
export default async () => {
	// The `MikroOrmModule` constructs all the configuration with auto-loaded entities.
	const app = await NestFactory.create(
		AppModule.forRoot({
			app: {
				name: process.env["npm_package_name"],
				version: process.env["npm_package_version"],
			},
			orm: { applyMigrations: false, connect: false },
		}),
		{ logger: ["error", "fatal"] },
	);

	const orm = app.get(MikroORM);

	// Let be sure to close the app (even if it is not supposed to run until the `listen` call)
	await app.close();
	const config = orm.config.getAll();

	// The seeder is only enabled for the CLI
	return deepmerge(config, { extensions: [SeedManager] } satisfies Partial<
		typeof config
	>);
};
