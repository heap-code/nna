import { LogLevel } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

import { OrmModuleSyncOptions } from "../../orm/orm.module";

/** The environment contains the information to run the application. */
export interface Environment {
	/** All information related to authentication */
	auth: {
		/** Default duration (in seconds) of an authenticated session */
		duration: number;
		/** The secret string (for JWT encoding) */
		secret: string;
	};
	/** All information related to the database */
	db: Pick<
		OrmModuleSyncOptions,
		"dbName" | "debug" | "host" | "password" | "port" | "user"
	>;
	/** All information to run the application */
	host: {
		/** The cors options for the host  */
		cors: {
			/**
			 * Configures the `Access-Control-Allow-Origins` CORS header.
			 * See [here for more detail](https://github.com/expressjs/cors#configuration-options).
			 */
			origin: Exclude<CorsOptions["origin"], undefined>;
		};
		/** Registers a prefix for every HTTP route path. */
		globalPrefix: string;
		/**
		 * The hostname this application will listen to
		 *
		 * @example "localhost"
		 * @example "0.0.0.0"
		 */
		name: string;
		/** The port this application will listen to */
		port: number;
	};
	/** NestJS logger */
	logger: LogLevel[] | boolean;
	/** Activates the swagger interface */
	swagger: boolean;
}
