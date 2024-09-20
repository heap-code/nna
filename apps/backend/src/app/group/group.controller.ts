import { Controller, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ControllerFor, HttpHandleRoute, createPayload } from "@nna/nest";
import { GROUP_HTTP_CONFIG, GroupHttp } from "~/common/group";
import { groupQueryDtoSchema } from "~/common/group/dtos";

import { GroupService } from "./group.service";

class GroupQueryPayload extends createPayload(groupQueryDtoSchema) {}

/** Controller for {@link GroupDto groups} */
@ApiTags("Groups")
@Controller()
export class GroupController implements ControllerFor<GroupHttp> {
	public constructor(private readonly service: GroupService) {}

	@HttpHandleRoute(GROUP_HTTP_CONFIG.routes.findAll)
	public async findAll(@Query() query: GroupQueryPayload) {
		const { filter, ...options } = query;
		return this.service.findAndCount(filter, options);
	}
}
