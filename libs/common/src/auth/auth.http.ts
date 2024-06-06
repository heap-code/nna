import { HttpRoute } from "@nna/core";

import { AuthLogin, AuthProfile, AuthRefresh, AuthSuccess } from "./dtos";

export const AUTH_HTTP_CONFIG = {
	path: "auth",
	routes: {
		getProfile: {
			method: "GET",
			path: "profile",
		},
		login: {
			method: "POST",
			path: "login",
		},
		logout: {
			method: "POST",
			path: "logout",
		},
		refresh: {
			method: "POST",
			path: "refresh",
		},
	} satisfies Record<keyof AuthHttp, HttpRoute>,
} as const;

/** HTTP specification for the Auth feature */
export interface AuthHttp {
	/** @returns the information of the connected session */
	getProfile(): Promise<AuthProfile.Dto>;
	/**
	 * Logs in a user
	 *
	 * @param body containing the credentials
	 */
	login(body: AuthLogin.Dto): Promise<AuthSuccess.Dto>;
	/** Logout a user (only useful with cookies) */
	logout(): Promise<void>;
	/**
	 * Refresh an existing token
	 *
	 * @param body the options when refreshing
	 */
	refresh(body: AuthRefresh.Dto): Promise<AuthSuccess.Dto>;
}
