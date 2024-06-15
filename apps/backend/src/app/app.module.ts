import { MikroORM } from "@mikro-orm/core";
import { DynamicModule, Logger, Module, OnModuleInit } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { extractModulesFromRoutes } from "@nna/nest";
import { LoggerModule } from "nestjs-pino";
import { PartialDeep } from "type-fest";

import { APP_ROUTES } from "./app.routes";
import {
	Configuration,
	ConfigurationModule,
	ConfigurationService,
} from "../configuration";
import { OrmModule } from "../orm/orm.module";

/** Options to run the application */
export type AppModuleOptions = PartialDeep<Configuration>;

/** The application module */
@Module({
	imports: [
		...extractModulesFromRoutes(APP_ROUTES),
		LoggerModule.forRootAsync({
			inject: [ConfigurationService],
			useFactory: ({ configuration }: ConfigurationService) => ({
				pinoHttp: {
					enabled: configuration.logger === "pino",
					level: "debug",
				},
			}),
		}),
		OrmModule.forRootAsync({
			inject: [ConfigurationService],
			useFactory: (service: ConfigurationService) =>
				service.getOrmOptions(),
		}),
		RouterModule.register(APP_ROUTES),
	],
})
export class AppModule implements OnModuleInit {
	/**
	 * Construct the final {@link AppModule} with additional configuration
	 *
	 * @param options to run the application
	 * @returns The dynamic module
	 */
	public static forRoot(options?: AppModuleOptions): DynamicModule {
		return {
			imports: [ConfigurationModule.forRoot(options ?? {})],
			module: AppModule,
		};
	}

	public constructor(
		private readonly orm: MikroORM,
		private readonly configurationService: ConfigurationService,
	) {}

	/** @inheritDoc */
	public async onModuleInit() {
		// The application will not run until this function finishes

		const logger = new Logger("ORM auto-migration");
		if (!this.configurationService.configuration.orm.applyMigrations) {
			logger.debug("Ignored by configuration");
			return;
		}

		const { migrator } = this.orm;
		const migrations = await migrator.getPendingMigrations();
		if (!migrations.length) {
			logger.debug("No migration to apply");
			return;
		}

		const names = migrations.map(({ name }) => name);
		logger.debug(
			`Applying ${migrations.length} migration(s) [${names.map(name => `'${name}'`).join(", ")}]`,
		);

		await migrator.up(names);
	}
}
