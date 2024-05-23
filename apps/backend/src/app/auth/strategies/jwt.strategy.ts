import { Injectable } from "@nestjs/common";
import { AbstractStrategy, PassportStrategy } from "@nestjs/passport";
import { ModelPrimaryKey } from "@nna/core";
import { Request } from "express";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";

import { UserEntity } from "../../user/user.entity";
import { AuthConfig } from "../auth.config";
import { AuthService } from "../auth.service";

/** The name of this strategy in passport */
export const AUTH_STRATEGY_JWT_NAME = "AUTH_STRATEGY_JWT";

/**
 * JWT strategy for authentication.
 * This is the default (an only) strategy for the all Identity and access management (IAM).
 *
 * Create others strategies and use them in the controller for login methods,
 * 	such as `local` (username, password) or 3rdp party (Google, Facebook, Microsoft, ...)
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
		super({
			ignoreExpiration: false,
			jwtFromRequest: ExtractJwt.fromExtractors<Request>([
				ExtractJwt.fromAuthHeaderAsBearerToken(),
				req => req.signedCookies,
			]),
			secretOrKeyProvider: () => this.config.config.secret,
		} satisfies StrategyOptions);
	}

	/** @inheritDoc */
	public validate(payload: unknown) {
		return this.service.validateJWT(payload);
	}
}

interface B<T extends string> {
	type: T;
}

type A = B<"local">;

interface JWTPlayload {
	// TODO
	method: A;
	/** Id of the user connected */
	userId: UserEntity[ModelPrimaryKey];
	/**
	 * The application version when the user logged in.
	 * It can be used to auto-logout users on updates.
	 */
	version: string;
}
