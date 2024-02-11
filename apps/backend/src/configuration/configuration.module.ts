import { Module } from "@nestjs/common";
import { ConfigurableModuleBuilder } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";

import { ENVIRONMENT } from "./environments";

// In one file to not export these constants
const {
	ASYNC_OPTIONS_TYPE,
	ConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN,
	OPTIONS_TYPE,
} = new ConfigurableModuleBuilder().setClassMethodName("forRoot").build();

/** Options for `forRoot` module register */
export type ConfigurationModuleSyncOptions = typeof OPTIONS_TYPE;
/** Options for `forRootAsync` module register */
export type ConfigurationModuleAsyncOptions = typeof ASYNC_OPTIONS_TYPE;

/** Service to access the configuration */
@Injectable()
export class ConfigurationService {
	// TODO

	private readonly ENVIRONMENT = ENVIRONMENT;

	/* @internal */
	public constructor(
		@Inject(MODULE_OPTIONS_TOKEN)
		private readonly options: ConfigurationModuleSyncOptions = {},
	) {}
}

/**
 * Module to define the configuration, later accessible via {@link ConfigurationService}
 */
@Module({ exports: [ConfigurationService], providers: [ConfigurationService] })
export class ConfigurationModule extends ConfigurableModuleClass {}
