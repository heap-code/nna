import { PrimaryKey, PrimaryKeyOptions } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { ModelNumber, ModelPrimaryKey } from "@nna/core";
import { deepmerge } from "deepmerge-ts";

import { EntityCommon, EntityCommonOptions } from "./entity.common";

export type Model = ModelNumber.Type;

export type EntityOptions<T> = EntityCommonOptions<T> &
	Partial<Record<ModelPrimaryKey, PrimaryKeyOptions<T>>>;

/**
 *
 * @param options
 */
export function Entity<T extends Model>(
	options: EntityOptions<T> = {},
): Type<Model> {
	const { _id = {}, ...common } = options;

	class EntityNumber extends EntityCommon(common) implements Model {
		/** Primary key */
		@PrimaryKey(deepmerge({ autoincrement: true }, _id))
		public readonly _id!: number;
	}

	return EntityNumber;
}
