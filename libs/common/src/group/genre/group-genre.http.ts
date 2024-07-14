import { HttpRoute } from "@nna/core";

/** Entrypoint route */
const entrypoint = HttpRoute.builder("group-genres");

/** HTTP configuration for the `group` feature */
export const GROUP_GENRE_HTTP_CONFIG = {
	routes: {} satisfies HttpRoute.Definitions,
} as const;

/** HTTP specification for the `group genre` feature */
export type GroupGenreHttp = HttpRoute.Handlers<
	typeof GROUP_GENRE_HTTP_CONFIG.routes
>;
