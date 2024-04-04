import { MikroOrmModule, MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import {
	ConfigurableModuleBuilder,
	DynamicModule,
	Module,
} from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { deepmerge } from "deepmerge-ts";

import {
	ForeignKeyConstraintFilter,
	NotFoundFilter,
	UniqueConstraintFilter,
} from "./filters";
import { ORM_DEFAULT_CONFIGURATION } from "./orm.default-config";

/** @internal */
const { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
	new ConfigurableModuleBuilder<OrmModuleSyncOptions>()
		.setClassMethodName("forRoot")
		.build();

/** Options for `forRoot` module register */
export interface OrmModuleSyncOptions {
	/** Configuration passed to the {@link MikroOrmModule} */
	orm: MikroOrmModuleOptions;

	// Let the possibility for configurable filters and such
}
/** Options for `forRootAsync` module register */
export type OrmModuleAsyncOptions = typeof ASYNC_OPTIONS_TYPE;

/**
 * Module that mainly includes {@link MikroOrmModule} with merge-able configuration.
 */
@Module({
	exports: [MODULE_OPTIONS_TOKEN],
	imports: [MikroOrmModule],
	providers: [
		{ provide: APP_FILTER, useClass: ForeignKeyConstraintFilter },
		{ provide: APP_FILTER, useClass: NotFoundFilter },
		{ provide: APP_FILTER, useClass: UniqueConstraintFilter },
	],
})
export class OrmModule extends ConfigurableModuleClass {
	/** @inheritDoc */
	public static forRoot(options: OrmModuleSyncOptions): DynamicModule {
		return this.addOrm(super.forRoot(options));
	}
	/** @inheritDoc */
	public static forRootAsync(options: OrmModuleAsyncOptions): DynamicModule {
		return this.addOrm(super.forRootAsync(options));
	}

	private static addOrm(dynamicModule: DynamicModule): DynamicModule {
		const { imports = [], ...module } = dynamicModule;
		return {
			...module,
			imports: [
				...imports,
				MikroOrmModule.forRootAsync({
					imports: [dynamicModule],
					inject: [MODULE_OPTIONS_TOKEN],
					useFactory: ({ orm }: OrmModuleSyncOptions) =>
						deepmerge(ORM_DEFAULT_CONFIGURATION, orm),
				}),
			],
		};
	}
}
