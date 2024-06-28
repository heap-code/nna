import { HttpRoute } from "@nna/core";

/** HTTP configuration for e2e controls */
export const E2E_HTTP_CONFIG = {
	entrypoint: "_e2e_",
	routes: {
		refreshDb: HttpRoute.builder("db/refresh").post<() => Promise<void>>(),
	} satisfies HttpRoute.Definitions,
} as const;

/** HTTP specification for e2e controls */
export type E2eHttp = HttpRoute.Handlers<typeof E2E_HTTP_CONFIG.routes>;
