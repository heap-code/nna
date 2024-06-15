import { ConfigurableModuleBuilder, Global, Module } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";
import { deepmergeCustom } from "deepmerge-ts";
import { PartialDeep } from "type-fest";

import { Configuration } from "./configuration.interface";
import { ENVIRONMENT } from "./environments";
import { OrmModuleSyncOptions } from "../orm/orm.module";

// In one file to not export these constants
const {
	ASYNC_OPTIONS_TYPE,
	ConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN,
	OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<PartialDeep<Configuration>>()
	.setClassMethodName("forRoot")
	.build();

/** Options for `forRoot` module register */
export type ConfigurationModuleSyncOptions = typeof OPTIONS_TYPE;
/** Options for `forRootAsync` module register */
export type ConfigurationModuleAsyncOptions = typeof ASYNC_OPTIONS_TYPE;

/** Service to access the configuration */
@Injectable()
export class ConfigurationService {
	/** The name of the application */
	public readonly APP_NAME: string;
	/** The version of the application */
	public readonly APP_VERSION: string;

	/** The final configuration, merged from the environment and the given configuration */
	public readonly configuration: Configuration;

	/* @internal */
	public constructor(
		@Inject(MODULE_OPTIONS_TOKEN)
		options: ConfigurationModuleSyncOptions = {},
	) {
		const { db, ...env } = ENVIRONMENT;

		this.configuration = deepmergeCustom({ mergeArrays: false })(
			{
				...env,
				app: { name: "unknown", version: "unknown" },
				orm: db,
			} satisfies Configuration,
			options as Configuration,
		);

		this.APP_NAME = this.configuration.app.name;
		this.APP_VERSION = this.configuration.app.version;
	}

	/**
	 * Returns The options for the ORM
	 *
	 * @returns The options for the ORM
	 */
	public getOrmOptions(): OrmModuleSyncOptions {
		const { applyMigrations: _, ...orm } = this.configuration.orm;
		return orm;
	}
}

/**
 * Module to define the configuration, later accessible via {@link ConfigurationService}
 */
@Global()
@Module({ exports: [ConfigurationService], providers: [ConfigurationService] })
export class ConfigurationModule extends ConfigurableModuleClass {}
