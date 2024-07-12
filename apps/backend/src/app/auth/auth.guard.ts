import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
	UseGuards,
	applyDecorators,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard as PassportGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiCookieAuth } from "@nestjs/swagger";
import { firstValueFrom, isObservable } from "rxjs";

import { AUTH_DEFAULT_STRATEGY_NAME } from "./strategies";

/** @internal */
const AuthParam = Reflector.createDecorator<UseAuthGuardParams>();

/** The default guard for any authentication */
@Injectable()
export class AuthGuard extends PassportGuard(AUTH_DEFAULT_STRATEGY_NAME) {
	public constructor(private readonly reflector: Reflector) {
		super();
	}

	/** @inheritDoc */
	public override async canActivate(context: ExecutionContext) {
		const canActivate = await this.isJwtValid(context);

		// Get AuthParam with the internal decorator
		const { optional = false } = this.reflector.getAllAndMerge(AuthParam, [
			context.getHandler(),
		]);

		if (!(canActivate || optional)) {
			// Returning false actually sends a forbidden error
			throw new UnauthorizedException();
		}

		return true;
	}

	private async isJwtValid(context: ExecutionContext) {
		// Get only the 'Passport-JWT' guard validation
		try {
			const canActivate$ = super.canActivate(context);
			// the `await` is necessary here (or else it become a catch in the caller)
			return await (isObservable(canActivate$)
				? firstValueFrom(canActivate$)
				: canActivate$);
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				return false;
			}

			throw error;
		}
	}
}

/** Authentication parameters passed to the {@link AuthGuard} */
export interface UseAuthGuardParams {
	/**
	 * Is the authentication optional?
	 * When true, the {@link AuthSession} will still be hydrated when the user is connected,
	 * but won't reject a 401 error otherwise
	 *
	 * @default false
	 */
	optional?: boolean;
}

/**
 * Creates a decorator with the needed decorators for authentication
 *
 * @param params to be used in {@link AuthGuard}
 * @returns The decorators applying API decorators, guard and parameters
 */
export function UseAuthGuard(params: UseAuthGuardParams = {}) {
	return applyDecorators(
		// Only for Swagger documentation
		ApiBearerAuth(),
		ApiCookieAuth(),
		// Applicative
		AuthParam(params),
		UseGuards(AuthGuard),
	);
}
