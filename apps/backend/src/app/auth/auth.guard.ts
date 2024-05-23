import { Injectable, UseGuards, applyDecorators } from "@nestjs/common";
import { AuthGuard as PassportGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AUTH_DEFAULT_STRATEGY_NAME } from "./strategies";

/** The default guard for any authentication */
@Injectable()
export class AuthGuard extends PassportGuard(AUTH_DEFAULT_STRATEGY_NAME) {}

/**
 * Creates a decorator with the needed decorators for authentication
 *
 * @returns The decorator applying Api decorators and guard
 */
export function useAuth() {
	return applyDecorators(ApiBearerAuth(), UseGuards(AuthGuard));
}
