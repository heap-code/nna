import { Schemas } from "@nna/core";
import type SMTPConnection from "nodemailer/lib/smtp-connection";
import * as z from "zod";

import { Environment } from "./environment.interface";

/**
 * Possible override from env shell (local).
 *
 * For other environments, prefer using a custom `environment.<env>.ts` file.
 * Even if it re-uses this content.
 */
export interface EnvironmentShellDefault {
	/** Override auth cookie name */
	readonly BE_AUTH_COOKIE_NAME?: string;
	/** Override auth secret */
	readonly BE_AUTH_SECRET?: string;

	/** Disable auto migrations */
	readonly BE_DB_APPLY_MIGRATION?: "false";
	/** Override DB host */
	readonly BE_DB_HOST?: string;
	/** Override DB name */
	readonly BE_DB_NAME?: string;
	/** Override DB pass */
	readonly BE_DB_PASS?: string;
	/** Override DB port */
	readonly BE_DB_PORT?: string;
	/** Override DB user */
	readonly BE_DB_USER?: string;

	/** Override HTTP hostname */
	readonly BE_HTTP_HOST?: string;
	/** Override HTTP port */
	readonly BE_HTTP_PORT?: string;
	/** Override HTTP prefix */
	readonly BE_HTTP_PREFIX?: string;

	/** Override MAIL password */
	readonly BE_MAIL_AUTH_PASS?: string;
	/** Override MAIL user */
	readonly BE_MAIL_AUTH_USER?: string;
	/** Override MAIL host */
	readonly BE_MAIL_HOST?: string;
	/** Override MAIL port */
	readonly BE_MAIL_PORT?: string;
	/** Override MAIL secure */
	readonly BE_MAIL_SECURE?: "true";
}

/** The environment typed with defaults */
export const envDefault = process.env as EnvironmentShellDefault;

/**
 * Cleans the configuration for email auth.
 *
 * Even when undefined, nodemailer will try to use any auth properties
 *
 * @param options to clean
 * @returns A clean configurations
 */
export function cleanEmailAuth(
	options: SMTPConnection.AuthenticationType,
): SMTPConnection.AuthenticationType {
	return Object.fromEntries(
		Object.entries(options).filter(([_, value]) => !!value),
	);
}

/**
 * Default environment.
 *
 * Used for local development.
 * Can also be used to be merged to any other environment
 */
export const ENVIRONMENT_DEFAULT: Environment = {
	auth: {
		cookie: {
			name: z
				.string()
				.default("authToken")
				.parse(envDefault.BE_AUTH_COOKIE_NAME),
			secure: false,
			signed: true,
		},
		// 1 hour
		duration: 60 * 60,
		secret: z
			.string()
			.default("Keep it secret!")
			.parse(envDefault.BE_AUTH_SECRET),
	},
	db: {
		applyMigrations: envDefault.BE_DB_APPLY_MIGRATION !== "false",
		dbName: z.string().min(1).default("db").parse(envDefault.BE_DB_NAME),
		debug: false,
		host: z
			.string()
			.min(1)
			.default("localhost")
			.parse(envDefault.BE_DB_HOST),
		password: z.string().default("PASSWORD").parse(envDefault.BE_DB_PASS),
		port: Schemas.port(z.coerce.number())
			.default(5432)
			.parse(envDefault.BE_DB_PORT),
		user: z.string().default("user").parse(envDefault.BE_DB_USER),
	},
	email: {
		actors: {
			sender: { address: "sender@host.local", name: "local sender" },
		},
		transport: {
			auth: cleanEmailAuth({
				pass: z.string().optional().parse(envDefault.BE_MAIL_AUTH_PASS),
				user: z.string().optional().parse(envDefault.BE_MAIL_AUTH_USER),

				// TODO: more?
			}),
			host: z
				.string()
				.min(1)
				.default("localhost")
				.parse(envDefault.BE_MAIL_HOST),
			port: Schemas.port(z.coerce.number())
				.default(1025)
				.parse(envDefault.BE_MAIL_PORT),
			secure: envDefault.BE_MAIL_SECURE === "true",
		},
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
		globalPrefix: z
			.string()
			.default("api")
			.parse(envDefault.BE_HTTP_PREFIX),
		name: z
			.string()
			.ip()
			.default("127.0.0.1")
			.parse(envDefault.BE_HTTP_HOST),
		port: Schemas.port(z.coerce.number())
			.default(3000)
			.parse(envDefault.BE_HTTP_PORT),
	},
	logger: ["debug", "error", "warn"],
	swagger: true,
};
