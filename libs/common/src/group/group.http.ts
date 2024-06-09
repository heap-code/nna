import { HttpRoute } from "@nna/core";

/** HTTP configuration for the `group` feature */
export const GROUP_HTTP_CONFIG = {
	entrypoint: "groups",
	routes: {} satisfies HttpRoute.Definitions,
} as const;

/** HTTP specification for the `group` feature */
export type GroupHttp = HttpRoute.Handlers<typeof GROUP_HTTP_CONFIG.routes>;
