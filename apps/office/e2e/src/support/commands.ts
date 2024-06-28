import { AnyFunction } from "@nna/core";
import * as z from "zod";
import { AUTH_HTTP_CONFIG, AuthLogin } from "~/common/auth";
import { UserSeedModel } from "~/testing/seeds";

/** Minimal data for E2E login */
export type CyUserLogin = Pick<UserSeedModel, "_password" | "username">;

const E2E_API = z
	.string()
	// TODO: a way to get this from configuration (or the build being tested)?
	.default("http://127.0.0.1:33000/e2e/api")
	.parse(process.env.FE_E2E_);

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

	const { method, path } = AUTH_HTTP_CONFIG.routes.getProfile;
	return cy.request(method, E2E_API + path({}), {
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
	const { method, path } = AUTH_HTTP_CONFIG.routes.logout;
	return cy.request(method, E2E_API + path({})).then(() => cy.clearCookies());
}

/**
 * Refresh the DB to a given state
 *
 * @returns Cypress chain
 */
function resetDB() {
	return cy.request("GET");
}

const CY_ADD_ONS = { loginWith, logout, resetDB } as const satisfies Record<
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
	}
}

for (const [key, fn] of Object.entries(CY_ADD_ONS)) {
	// Add implementations
	Cypress.Commands.add(key as never, fn);
}
