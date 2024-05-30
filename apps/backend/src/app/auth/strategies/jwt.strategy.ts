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
import { JWT } from "../jwt";

/** The name of this strategy in passport */
export const AUTH_STRATEGY_JWT_NAME = "AUTH_STRATEGY_JWT";

/**
 * JWT strategy for authentication.
 * This is the default (and only) strategy for all Identity and access management (IAM).
 *
 * Create others strategies and use them in the controller for login methods,
 * 	such as  3rdp party (Google, Facebook, Microsoft, ...)
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
			const { cookie } = this.config.config;
			if (!cookie) {
				return () => null;
			}

			const { name } = cookie;
			// TODO: from signedCookies?
			return ({ cookies }) => (cookies as Record<string, string>)[name];
		});

		super({
			ignoreExpiration: false,
			jwtFromRequest: ExtractJwt.fromExtractors<Request>([
				ExtractJwt.fromAuthHeaderAsBearerToken(),
				request => extractor.get()(request),
			]),
			secretOrKeyProvider: () => this.config.config.secret,
		} satisfies StrategyOptions);
	}

	/** @inheritDoc */
	public validate(payload: JWT.Payload) {
		return this.service.validateJWT(payload);
	}
}
