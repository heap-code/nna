import { Schemas } from "@nna/core";
import * as z from "zod";

import { Environment } from "./environment.interface";

/**
 * Possible override from env shell (local).
 *
 * For other environments, prefer using a custom `environment.<env>.ts` file.
 * Even if it also uses `process.env.<...>`.
 */
export interface EnvironmentShellDefault {
	/** Override auth cookie, set `false` to disable (enabled by default) */
	BE_AUTH_COOKIE?: "false" | "true";
	/** Override auth cookie name, useless without {@link BE_AUTH_COOKIE} */
	BE_AUTH_COOKIE_NAME?: string;
	/** Override auth secret */
	BE_AUTH_SECRET?: string;

	/** Override DB host */
	BE_DB_HOST?: string;
	/** Override DB name */
	BE_DB_NAME?: string;
	/** Override DB pass */
	BE_DB_PASS?: string;
	/** Override DB port */
	BE_DB_PORT?: string;
	/** Override DB user */
	BE_DB_USER?: string;

	/** Override HTTP hostname */
	BE_HTTP_HOST?: string;
	/** Override HTTP port */
	BE_HTTP_PORT?: string;
	/** Override HTTP prefix */
	BE_HTTP_PREFIX?: string;
}

/** The environment typed with defaults */
const env = process.env as EnvironmentShellDefault;

/**
 * Default environment.
 *
 * Used for local development.
 * Can also be used to be merged to any other environment
 */
export const ENVIRONMENT_DEFAULT: Environment = {
	auth: {
		cookie:
			env.BE_AUTH_COOKIE === "false"
				? false
				: {
						name: z
							.string()
							.default("auth_cookie")
							.parse(env.BE_AUTH_COOKIE_NAME),
					},
		// 1 hour
		duration: 60 * 60,
		secret: z.string().min(1).default("a secret").parse(env.BE_AUTH_SECRET),
	},
	db: {
		dbName: z.string().min(1).default("nna").parse(env.BE_DB_NAME),
		debug: false,
		host: z.string().min(1).default("localhost").parse(env.BE_DB_NAME),
		password: z.string().default("PASSWORD").parse(env.BE_DB_PASS),
		port: Schemas.port(z.coerce.number())
			.default(5432)
			.parse(env.BE_DB_PORT),
		user: z.string().default("nna").parse(env.BE_DB_USER),
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
		globalPrefix: z.string().default("api").parse(env.BE_HTTP_PREFIX),
		name: z.string().ip().default("127.0.0.1").parse(env.BE_HTTP_HOST),
		port: Schemas.port(z.coerce.number())
			.default(3000)
			.parse(env.BE_HTTP_PORT),
	},
	logger: ["debug", "error", "warn"],
	swagger: true,
};
