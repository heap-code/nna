import { Environment } from "./environments";
import { OrmModuleSyncOptions } from "../orm/orm.module";

/**
 * The configuration is mainly deducted by the {@link Environment}.
 *
 * It can be overridden for specific usages (such as testing).
 */
export interface Configuration extends Omit<Environment, "db"> {
	/** NPM information */
	npm: {
		/** Name of the app */
		name: string;
		/** Version of the app */
		version: string;
	};
	/** The orm configuration to merge into the deducted one */
	orm: OrmModuleSyncOptions;
}
