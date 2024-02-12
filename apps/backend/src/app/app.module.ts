import { DynamicModule, Module } from "@nestjs/common";
import { PartialDeep } from "type-fest";

import { GroupModule } from "./group/group.module";
import { UserModule } from "./user/user.module";
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
		GroupModule,
		OrmModule.forRootAsync({
			inject: [ConfigurationService],
			useFactory: (service: ConfigurationService) =>
				service.getOrmOptions(),
		}),
		UserModule,
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
