import { AnyFunction } from "@nna/core";
import * as z from "zod";
import { AUTH_HTTP_CONFIG, AuthLogin } from "~/common/auth";
import { E2eHttp } from "~/testing/e2e";
import { SeedGenerator, Seeding } from "~/testing/seeds";

/** Minimal data for E2E login */
export type CyUserLogin = Pick<Seeding.UserSeed, "_password" | "username">;

const E2E_API = z
	.string()
	// TODO: a way to get this from configuration (or the build being tested)?
	.default("http://localhost:33000/e2e/api")
	.parse(process.env.OF_E2E_API_URL);

/**
 * Logs the session with the given user object
 *
 * @param user to log with
 * @returns Cypress chain
 */
function loginWith(user: CyUserLogin): Cypress.Chainable;
/**
 * Logs the session with the given user credentials
 *
 * @param username for the credentials
 * @param password for the credentials
 * @returns Cypress chain
 */
function loginWith(username: string, password: string): Cypress.Chainable;
function loginWith(username: CyUserLogin | string, password = "") {
	if (typeof username !== "string") {
		return loginWith(username.username, username._password);
	}

	const { entrypoint, routes } = AUTH_HTTP_CONFIG;
	const { method, path } = routes.login;
	return cy.request(method, `${E2E_API}/${entrypoint}${path({})}`, {
		cookie: true,
		password,
		username,
	} satisfies AuthLogin.Dto);
}
/**
 * Removes login data
 *
 * @returns Cypress chain
 */
function logout() {
	const { entrypoint, routes } = AUTH_HTTP_CONFIG;
	const { method, path } = routes.login;
	return cy
		.request(method, `${E2E_API}/${entrypoint}${path({})}`)
		.then(() => cy.clearCookies());
}

/**
 * Refresh the DB to a given state
 *
 * @param param to set refresh data
 * @returns Cypress chain
 */
function refreshDb<P extends SeedGenerator.GenerateParameter>(
	param: P,
): Cypress.Chainable<SeedGenerator.GetSeedFromGenerator<P>> {
	const { entrypoint, routes } = E2eHttp.CONFIG;
	const { method, path } = routes.refreshDb;

	return cy
		.request(method, `${E2E_API}/${entrypoint}${path({})}`, param)
		.then(({ body }) => body as never);
}

const CY_ADD_ONS = { loginWith, logout, refreshDb } as const satisfies Record<
	string,
	AnyFunction
>;

/** @internal */
type _CyAddOns = typeof CY_ADD_ONS;
/** @internal */
type CyChain = { [K in keyof _CyAddOns]: _CyAddOns[K] };

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace -- Needed for type-merging
	namespace Cypress {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface -- Needed for type-merging
		interface Chainable extends CyChain {}

		type ExtractFromChainable<T extends Chainable> =
			T extends Chainable<infer U> ? U : never;
	}
}

Cypress.Commands.addAll(CY_ADD_ONS);
