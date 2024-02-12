import { Environment } from "./environment.interface";

/**
 * Default environment.
 *
 * Used for local development.
 * Can also be used to be merged to any other environment
 */
export const ENVIRONMENT_DEFAULT: Environment = {
	db: {
		dbName: "nna",
		debug: false,
		host: "localhost",
		password: "LOCAL_PASSWORD",
		port: 5432,
		user: "nna",
	},
	host: {
		cors: {
			origin: [
				/\/\/127.0.0.\d{1,3}/,
				/\/{2}192.168(?:.\d{1,3}){2}/,
				/\/\/localhost(:\d{1,5})+/,
			],
		},
		globalPrefix: "api",
		name: "127.0.0.1",
		port: 3000,
	},
	logger: ["debug", "error", "warn"],
	swagger: true,
};
