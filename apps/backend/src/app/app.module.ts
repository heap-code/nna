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

export type AppModuleOptions = PartialDeep<Configuration>;

@Module({
	imports: [
		ConfigurationModule,
		GroupModule,
		OrmModule.forRootAsync({
			useFactory: (service: ConfigurationService) => ({
				// TODO
			}),
		}),
		UserModule,
	],
})
export class AppModule {
	public static forRoot(options?: AppModuleOptions): DynamicModule {
		// TODO
		return { module: AppModule };
	}
}
