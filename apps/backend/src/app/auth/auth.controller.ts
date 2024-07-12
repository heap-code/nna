import { Body, Controller, HttpCode, HttpStatus, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ControllerFor, HttpHandleRoute } from "@nna/nest";
import { Response } from "express";
import { AUTH_HTTP_CONFIG, AuthHttp, AuthProfile } from "~/common/auth";

import { AuthConfig } from "./auth.config";
import { UseAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { JWT } from "./jwt";
import {
	AuthLoginPayload,
	AuthProfilePayload,
	AuthRefreshPayload,
	AuthSuccessPayload,
} from "./payloads";
import { AuthSession, AuthSessionParam } from "./session";

/** Controller for authentication operations */
@ApiTags("Auth")
@Controller()
export class AuthController implements ControllerFor<AuthHttp> {
	public constructor(
		private readonly config: AuthConfig,
		private readonly service: AuthService,
	) {}

	/** Gets the information of the connected session */
	@HttpHandleRoute(AUTH_HTTP_CONFIG.routes.getProfile)
	@UseAuthGuard()
	public async getProfile(
		@AuthSessionParam() session: AuthSession,
	): Promise<AuthProfilePayload> {
		const { expireOn, getUser, issuedAt } = session;
		return AuthProfile.schema.strip().parse({
			// The parse will only keep what is needed
			expireOn,
			issuedAt,
			user: await getUser(),
		});
	}

	/** Logs in a user */
	@HttpHandleRoute(AUTH_HTTP_CONFIG.routes.login)
	public async login(
		@Body() body: AuthLoginPayload,
		@Res({ passthrough: true }) res: Response,
	): Promise<AuthSuccessPayload> {
		const { cookie = false, password, username } = body;
		return this.service
			.createJwtPayloadFromCredentials(username, password)
			.then(([result]) => this.signAndSendToken(res, result, cookie));
	}

	/** Logs out a user (only useful with cookies => clears cookie) */
	@HttpCode(HttpStatus.NO_CONTENT)
	@HttpHandleRoute(AUTH_HTTP_CONFIG.routes.logout)
	public logout(@Res({ passthrough: true }) res: Response) {
		this.clearAuthCookie(res);
		return Promise.resolve();
	}

	/** Refreshes an existing token */
	@HttpHandleRoute(AUTH_HTTP_CONFIG.routes.refresh)
	@UseAuthGuard()
	public async refresh(
		@Body() body: AuthRefreshPayload,
		@AuthSessionParam() session: AuthSession,
		@Res({ passthrough: true }) res: Response,
	): Promise<AuthSuccessPayload> {
		return Promise.resolve(
			this.signAndSendToken(res, session.payload, body.cookie ?? false),
		);
	}

	private async signAndSendToken(
		res: Response,
		payload: JWT.Payload,
		sendCookie: boolean,
	): Promise<AuthSuccessPayload> {
		const { expireOn, issuedAt, token } =
			await this.service.signJwtPayload(payload);

		if (sendCookie) {
			this.setAuthCookie(res, token, expireOn);
		}

		return { expireOn, issuedAt, token };
	}

	private setAuthCookie(res: Response, token: string, expires: Date) {
		const { name } = this.config.cookie;
		return res.cookie(name, token, {
			...this.config.getCookieOptions(),
			expires,
		});
	}
	private clearAuthCookie(res: Response) {
		const { name } = this.config.cookie;
		return res.clearCookie(name, this.config.getCookieOptions());
	}
}
