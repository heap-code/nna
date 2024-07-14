import { HttpRoute, QueryResults } from "@nna/core";

import { GroupDto, GroupQueryDto } from "./dtos";

/** Entrypoint route */
const entrypoint = HttpRoute.builder("groups");

/** HTTP configuration for the `group` feature */
export const GROUP_HTTP_CONFIG = {
	routes: {
		findAll:
			entrypoint.get<
				(query: GroupQueryDto) => Promise<QueryResults<GroupDto>>
			>(),
	} satisfies HttpRoute.Definitions,
} as const;

/** HTTP specification for the `group` feature */
export type GroupHttp = HttpRoute.Handlers<typeof GROUP_HTTP_CONFIG.routes>;
