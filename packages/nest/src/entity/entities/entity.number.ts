import { PrimaryKey, PrimaryKeyOptions } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { ModelNumber, ModelPrimaryKey } from "@nna/core";

import { EntityCommon, EntityCommonOptions } from "./entity.common";

export type Options<T> = EntityCommonOptions<T> &
	Partial<Record<ModelPrimaryKey, PrimaryKeyOptions<T>>>;

/**
 *
 * @param options
 */
export function EntityNumber<T extends ModelNumber.Type>(
	options: Options<T> = {},
): Type<ModelNumber.Type> {
	const { _id, ...common } = options;

	class EntityNumber
		extends EntityCommon(common)
		implements ModelNumber.Type
	{
		@PrimaryKey()
		public readonly _id!: number;
	}

	return EntityNumber;
}
