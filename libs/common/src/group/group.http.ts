import { HttpRoute, QueryResults } from "@nna/core";

import { GroupDto, GroupQueryDto } from "./dtos";

/** HTTP configuration for the `group` feature */
export const GROUP_HTTP_CONFIG = {
	entrypoint: "groups",
	routes: {
		findAll:
			HttpRoute.builder("/").get<
				(query: GroupQueryDto) => Promise<QueryResults<GroupDto>>
			>(),
	} satisfies HttpRoute.Definitions,
} as const;

/** HTTP specification for the `group` feature */
export type GroupHttp = HttpRoute.Handlers<typeof GROUP_HTTP_CONFIG.routes>;
