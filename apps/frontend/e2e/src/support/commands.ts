import { AnyFunction } from "@nna/core";
import { AUTH_HTTP_CONFIG, AuthLogin } from "~/common/auth";
import { E2eHttp } from "~/testing/e2e";
import { SeedGenerator, Seeding } from "~/testing/seeds";

/** Minimal data for E2E login */
export type CyUserLogin = Pick<Seeding.UserSeed, "_password" | "username">;

/** E2E API URL */
const E2E_API = Cypress.env("E2E_API") as string;
/** MailHog Client (& API) URL */
const MAIL_HOG_URL = Cypress.env("MAIL_HOG_URL") as string;

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

	const { routes } = AUTH_HTTP_CONFIG;
	const { method, path } = routes.login;

	return cy.request(method, `${E2E_API}${path({})}`, {
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
	const { routes } = AUTH_HTTP_CONFIG;
	const { method, path } = routes.login;
	return cy
		.request(method, `${E2E_API}${path({})}`)
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
	const { routes } = E2eHttp.CONFIG;
	const { method, path } = routes.refreshDb;

	return cy
		.request(method, `${E2E_API}${path({})}`, param)
		.then(({ body }) => body as never);
}

/**
 * Visits the mail client
 * Run {@link emailDeleteAll} before an operation that sends mails to avoid errors
 *
 * @returns Cypress chain
 */
function emailVisit() {
	return cy.visit(MAIL_HOG_URL);
}

/**
 * Deletes all mails in the client
 *
 * @returns Cypress chain
 */
function emailDeleteAll() {
	return cy.request("DELETE", `${MAIL_HOG_URL}/api/v1/messages`);
}

const CY_ADD_ONS = {
	emailDeleteAll,
	emailVisit,
	loginWith,
	logout,
	refreshDb,
} as const satisfies Record<string, AnyFunction>;

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
