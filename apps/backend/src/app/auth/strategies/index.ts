import { Type } from "@nestjs/common";
import { AbstractStrategy } from "@nestjs/passport";

import { AuthJwtStrategy } from "./jwt.strategy";

export { AUTH_STRATEGY_JWT_NAME as AUTH_DEFAULT_STRATEGY_NAME } from "./jwt.strategy";

/** List of all used strategies */
export const AUTH_STRATEGIES: ReadonlyArray<Type<AbstractStrategy>> = [
	AuthJwtStrategy,
];
