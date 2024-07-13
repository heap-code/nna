import { HttpRoute } from "@nna/core";

/** HTTP configuration for the `user` feature */
export const USER_HTTP_CONFIG = {
	routes: {} satisfies HttpRoute.Definitions,
} as const;

/** HTTP specification for the `user` feature */
export type UserHttp = HttpRoute.Handlers<typeof USER_HTTP_CONFIG.routes>;
