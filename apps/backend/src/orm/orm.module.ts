import {
	ConfigurableModuleBuilder,
	DynamicModule,
	Module,
} from "@nestjs/common";
import {
	OrmModule as NnaOrmModule,
	OrmModuleSyncOptions as NnaOrmModuleSyncOptions,
} from "@nna/nest";
import { deepmerge } from "deepmerge-ts";

import { ORM_DEFAULT_CONFIGURATION } from "./orm.default-config";

/** @internal */
const { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
	new ConfigurableModuleBuilder<OrmModuleSyncOptions>()
		.setClassMethodName("forRoot")
		.build();

/** Options for `forRoot` module register */
export type OrmModuleSyncOptions = NnaOrmModuleSyncOptions;
/** Options for `forRootAsync` module register */
export type OrmModuleAsyncOptions = typeof ASYNC_OPTIONS_TYPE;

/**
 * Module that extends or overrides the default {@link NnaOrmModule} for app % CLI usage.
 */
@Module({ exports: [MODULE_OPTIONS_TOKEN] })
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
				NnaOrmModule.forRootAsync({
					imports: [dynamicModule],
					inject: [MODULE_OPTIONS_TOKEN],
					useFactory: ({
						orm,
						...options
					}: OrmModuleSyncOptions) => ({
						...options,
						orm: deepmerge(ORM_DEFAULT_CONFIGURATION, orm),
					}),
				}),
			],
		};
	}
}
