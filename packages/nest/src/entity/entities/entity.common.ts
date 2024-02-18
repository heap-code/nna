import { Property, PropertyOptions } from "@mikro-orm/core";
import { ModelAny, ModelPrimaryKey } from "@nna/core";
import { deepmerge } from "deepmerge-ts";

export type EntityCommonOptions<T> = Partial<
	Record<keyof Omit<ModelAny, ModelPrimaryKey>, PropertyOptions<T>>
>;

/** @internal */
type ModelWithoutPK = Omit<ModelAny, ModelPrimaryKey>;

/**
 *
 * @param options
 */
export function EntityCommon<T extends ModelWithoutPK>(
	options: EntityCommonOptions<T> = {},
) {
	const { createdAt = {}, updatedAt = [] } = options;

	abstract class EntityCommon implements ModelWithoutPK {
		/** The date when this entity has been created */
		@Property(deepmerge({ default: Date.now() }, createdAt))
		public readonly createdAt!: Date;
		/** The date when this entity has been updated */
		@Property(
			deepmerge(
				{ default: Date.now(), onUpdate: () => new Date() },
				updatedAt,
			),
		)
		public readonly updatedAt!: Date;
	}

	return EntityCommon;
}
