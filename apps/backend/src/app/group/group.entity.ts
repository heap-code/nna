import { Entity } from "@mikro-orm/core";
import { EntityNumber } from "@nna/nest";

import { GroupRepository } from "./group.repository";

@Entity({ repository: () => GroupRepository })
export class GroupEntity extends EntityNumber.Entity() {}
