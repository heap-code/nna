import { Singleton } from "@heap-code/singleton";
import { Injectable } from "@nestjs/common";
import { AbstractStrategy, PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import {
	Strategy,
	ExtractJwt,
	StrategyOptions,
	JwtFromRequestFunction,
} from "passport-jwt";

import { AuthConfig } from "../auth.config";
import { AuthService } from "../auth.service";
import { AuthSession } from "../session/auth.session";

/** The name of this strategy in passport */
export const AUTH_STRATEGY_JWT_NAME = "AUTH_STRATEGY_JWT";

/**
 * JWT strategy for authentication.
 * This is the default (and only) strategy for all Identity and access management (IAM).
 *
 * Create others strategies and use them in the controller for login methods,
 * 	such as 3rdp party (Google, Facebook, Microsoft, ...)
 */
@Injectable()
export class AuthJwtStrategy
	extends PassportStrategy(Strategy, AUTH_STRATEGY_JWT_NAME)
	implements AbstractStrategy
{
	public constructor(
		private readonly config: AuthConfig,
		private readonly service: AuthService,
	) {
		const extractor = new Singleton<JwtFromRequestFunction<Request>>(() => {
			const { name, signed } = this.config.cookie;

			const fromCookies = (cookies: Record<string, string> | undefined) =>
				cookies?.[name] || null;
			return signed
				? ({ signedCookies }) => fromCookies(signedCookies)
				: ({ cookies }) => fromCookies(cookies);
		});

		super({
			ignoreExpiration: false,
			jwtFromRequest: ExtractJwt.fromExtractors<Request>([
				ExtractJwt.fromAuthHeaderAsBearerToken(),
				request => extractor.get()(request),
			]),
			secretOrKeyProvider: (_1, _2, done) =>
				done(null, this.config.secret),
		} satisfies StrategyOptions);
	}

	/** @inheritDoc */
	public async validate(raw: unknown): Promise<AuthSession> {
		const payload = await this.service.validateJwtPayload(raw);

		// This is more than "validate" as the result of this
		//	will be injected in the `request.user` of the framework
		return this.service.hydrateJwt(payload);
	}
}
