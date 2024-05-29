import { DynamicModule, Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { extractModulesFromRoutes } from "@nna/nest";
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
		OrmModule.forRootAsync({
			inject: [ConfigurationService],
			useFactory: (service: ConfigurationService) =>
				service.getOrmOptions(),
		}),
		RouterModule.register(APP_ROUTES),
	],
})
export class AppModule {
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
}
