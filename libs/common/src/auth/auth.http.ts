import { HttpRoute } from "@nna/core";

import { AuthLogin, AuthProfile, AuthRefresh, AuthSuccess } from "./dtos";

/** HTTP configuration for the Auth feature */
export const AUTH_HTTP_CONFIG = {
	path: "auth",
	routes: {
		/** Returns the information of the connected session */
		getProfile:
			HttpRoute.builder("profile").get<() => Promise<AuthProfile.Dto>>(),
		/** Logs in a user */
		login: HttpRoute.builder("login").post<
			(body: AuthLogin.Dto) => Promise<AuthSuccess.Dto>
		>(),
		/** Logout a user (only useful with cookies) */
		logout: HttpRoute.builder("logout").post<() => Promise<void>>(),
		/** Refresh an existing token */
		refresh:
			HttpRoute.builder("refresh").post<
				(body: AuthRefresh.Dto) => Promise<AuthSuccess.Dto>
			>(),
	} satisfies HttpRoute.Definitions,
} as const;

/** HTTP specification for the Auth feature */
export type AuthHttp = HttpRoute.Handlers<typeof AUTH_HTTP_CONFIG.routes>;
