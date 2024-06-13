import { HttpRoute } from "@nna/core";

/** HTTP configuration for the `group` feature */
export const GROUP_GENRE_HTTP_CONFIG = {
	entrypoint: "group-genres",
	routes: {} satisfies HttpRoute.Definitions,
} as const;

/** HTTP specification for the `group genre` feature */
export type GroupGenreHttp = HttpRoute.Handlers<
	typeof GROUP_GENRE_HTTP_CONFIG.routes
>;
