import { ConfigurableModuleBuilder, Global, Module } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";
import { deepmerge } from "deepmerge-ts";
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

// Injected from webpack. These are no variables, but "MACROs".
/** @internal */
declare const __NPM_NAME__: string;
/** @internal */
declare const __NPM_VERSION__: string;

/** Service to access the configuration */
@Injectable()
export class ConfigurationService {
	/** The name of the application (from `package.json`) */
	public readonly APP_NAME = __NPM_NAME__;
	/** The version of the application (from `package.json`) */
	public readonly APP_VERSION = __NPM_VERSION__;

	/** The final configuration, merged from the environment and the given configuration */
	public readonly configuration: Configuration;

	/* @internal */
	public constructor(
		@Inject(MODULE_OPTIONS_TOKEN)
		options: ConfigurationModuleSyncOptions = {},
	) {
		const { db, ...env } = ENVIRONMENT;

		this.configuration = deepmerge(
			{ ...env, orm: db } satisfies Configuration,
			options as Configuration,
		);
	}

	/**
	 * Returns The options for the ORM
	 *
	 * @returns The options for the ORM
	 */
	public getOrmOptions(): OrmModuleSyncOptions {
		return this.configuration.orm;
	}
}

/**
 * Module to define the configuration, later accessible via {@link ConfigurationService}
 */
@Global()
@Module({ exports: [ConfigurationService], providers: [ConfigurationService] })
export class ConfigurationModule extends ConfigurableModuleClass {}
