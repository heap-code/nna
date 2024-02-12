import { Environment } from "./environment.interface";

/**
 * Possible override from env shell (local).
 *
 * For other environments, prefer using a custom `environment.<env>.ts` file.
 * Even if it also uses `process.env.<...>`.
 */
interface EnvironmentShellDefault {
	/** Override DB host */
	NNA_DB_HOST?: string;
	/** Override DB name */
	NNA_DB_NAME?: string;
	/** Override DB pass */
	NNA_DB_PASS?: string;
	/** Override DB port */
	NNA_DB_PORT?: string;
	/** Override DB user */
	NNA_DB_USER?: string;

	/** Override HTTP hostname */
	NNA_HTTP_HOST?: string;
	/** Override HTTP port */
	NNA_HTTP_PORT?: string;
	/** Override HTTP prefix */
	NNA_HTTP_PREFIX?: string;
}

/** @internal */
const env = process.env as EnvironmentShellDefault;

/**
 * Default environment.
 *
 * Used for local development.
 * Can also be used to be merged to any other environment
 */
export const ENVIRONMENT_DEFAULT: Environment = {
	db: {
		dbName: env.NNA_DB_NAME || "nna",
		debug: false,
		host: env.NNA_DB_HOST || "localhost",
		password: env.NNA_DB_PASS || "LOCAL_PASSWORD",
		port: env.NNA_DB_PORT ? Number(env.NNA_DB_PORT) : 5432,
		user: env.NNA_DB_USER || "nna",
	},
	host: {
		cors: {
			origin: [
				// localhost
				/\/\/127.0.0.\d{1,3}/,
				/\/\/localhost(:\d{1,5})?/,
				// private networks
				/\/\/192.168(?:.\d{1,3}){2}/,
				/\/\/172.(1[6-9]|2\d|3[01])(?:.\d{1,3}){2}/,
			],
		},
		globalPrefix: env.NNA_HTTP_PREFIX || "api",
		name: env.NNA_HTTP_HOST || "127.0.0.1",
		port: env.NNA_HTTP_PORT ? Number(env.NNA_DB_PORT) : 3000,
	},
	logger: ["debug", "error", "warn"],
	swagger: true,
};
