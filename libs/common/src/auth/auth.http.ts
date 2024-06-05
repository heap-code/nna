import {
	AuthLoginDto,
	AuthProfileDto,
	AuthRefreshDto,
	AuthSuccessDto,
} from "./dtos";

export const AUTH_HTTP_CONFIG = {
	path: "auth",
	// TODO
	paths: {
		getProfile: "profile",
		login: "login",
		logout: "logout",
		refresh: "refresh",
	} satisfies Record<keyof AuthHttp, unknown>,
} as const;

/** HTTP specification for the Auth feature */
export interface AuthHttp {
	// TODO

	/** @returns the information of the connected session */
	getProfile(): Promise<AuthProfileDto>;
	/**
	 * Logs in a user
	 *
	 * @param body containing the credentials
	 */
	login(body: AuthLoginDto): Promise<AuthSuccessDto>;
	/** Logout a user (only useful with cookies) */
	logout(): Promise<void>;
	/**
	 * Refresh an existing token
	 *
	 * @param body the options when refreshing
	 */
	refresh(body: AuthRefreshDto): Promise<AuthSuccessDto>;
}
