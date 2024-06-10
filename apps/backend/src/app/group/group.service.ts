import { Injectable } from "@nestjs/common";
import { entityServiceBuilder } from "@nna/nest";

import { GroupEntity } from "./group.entity";
import { GroupRepository } from "./group.repository";

/** Service for the `group` features */
@Injectable()
export class GroupService extends entityServiceBuilder<GroupEntity>().getClass() {
	public constructor(repository: GroupRepository) {
		super(repository);
	}
}
