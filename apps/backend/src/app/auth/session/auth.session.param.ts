import { ExecutionContext, createParamDecorator } from "@nestjs/common";

import { AuthSession } from "./auth.session";

/**
 * Extract the {@link AuthSession} from an request
 *
 * @param request to extract from
 * @returns {AuthSession} if available
 */
export function extractAuthSessionFromRequest(
	request: Express.Request,
): AuthSession | null {
	return (request.user ?? null) as AuthSession;
}

/**
 * Extract the {@link AuthSession} from an execution context
 *
 * @param context to extract from
 * @returns {AuthSession} if available
 */
export function extractAuthSessionFromContext(
	context: ExecutionContext,
): ReturnType<typeof extractAuthSessionFromRequest> {
	return extractAuthSessionFromRequest(
		context.switchToHttp().getRequest<Express.Request>(),
	);
}

/**
 * Injects the {@link AuthSession} data (when available) from the request into a parameter
 *
 * @example
 * class Controller {
 * 	\@UseAuth()
 * 	public myHandler0(@AuthSessionParam() me: AuthSession);
 * 	\@UseAuth({ optional: true })
 * 	public myHandler1(@AuthSessionParam() me: AuthSession | null);
 * }
 */
export const AuthSessionParam = createParamDecorator<never, ExecutionContext>(
	(_, context) => extractAuthSessionFromContext(context),
);
