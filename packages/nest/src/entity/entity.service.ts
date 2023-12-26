import { EntityRepository } from "@mikro-orm/core";

import { EntityBase } from "./entity.base";

export abstract class EntityService<
	T extends EntityBase,
	ToCreate,
	ToUpdate,
	Repository extends EntityRepository<T> = EntityRepository<T>,
> {
	protected constructor(protected readonly repository: Repository) {}
}
