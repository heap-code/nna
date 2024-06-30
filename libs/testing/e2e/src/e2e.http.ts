import { HttpRoute } from "@nna/core";
import { SeedGenerator } from "~/testing/seeds";

export const refreshDbSchema = SeedGenerator.generateParameterSchema;
export type RefreshDb = SeedGenerator.Generate;

/** HTTP configuration for e2e controls */
export const CONFIG = {
	entrypoint: "_e2e_",
	routes: {
		refreshDb: HttpRoute.builder("db/refresh").post<RefreshDb>(),
	} satisfies HttpRoute.Definitions,
} as const;

/** HTTP specification for e2e controls */
export type Http = HttpRoute.Handlers<typeof CONFIG.routes>;
