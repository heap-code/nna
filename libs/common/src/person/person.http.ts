import { HttpRoute } from "@nna/core";

/** HTTP configuration for the `person` feature */
export const PERSON_HTTP_CONFIG = {
	entrypoint: "persons",
	routes: {} satisfies HttpRoute.Definitions,
} as const;

/** HTTP specification for the `person` feature */
export type PersonHttp = HttpRoute.Handlers<typeof PERSON_HTTP_CONFIG.routes>;
