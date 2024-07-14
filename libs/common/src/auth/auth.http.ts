import { HttpRoute } from "@nna/core";

import { AuthLogin, AuthProfile, AuthRefresh, AuthSuccess } from "./dtos";

/** Entrypoint route */
const entrypoint = HttpRoute.builder("auth");

/** HTTP configuration for the Auth feature */
export const AUTH_HTTP_CONFIG = {
	routes: {
		/** Returns the information of the connected session */
		getProfile: entrypoint
			.addSegment("profile")
			.get<() => Promise<AuthProfile.Dto>>(),
		/** Logs in a user */
		login: entrypoint
			.addSegment("login")
			.post<(body: AuthLogin.Dto) => Promise<AuthSuccess.Dto>>(),
		/** Logout a user (only useful with cookies) */
		logout: entrypoint.addSegment("logout").post<() => Promise<void>>(),
		/** Refresh an existing token */
		refresh: entrypoint
			.addSegment("refresh")
			.post<(body: AuthRefresh.Dto) => Promise<AuthSuccess.Dto>>(),
	} satisfies HttpRoute.Definitions,
} as const;

/** HTTP specification for the Auth feature */
export type AuthHttp = HttpRoute.Handlers<typeof AUTH_HTTP_CONFIG.routes>;
