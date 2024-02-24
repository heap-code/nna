import { Property, PropertyOptions } from "@mikro-orm/core";
import { ModelAny, ModelPrimaryKey } from "@nna/core";
import { deepmerge } from "deepmerge-ts";
import { AbstractConstructor } from "type-fest";

/** @internal */
export type ModelWithoutPK = Omit<ModelAny, ModelPrimaryKey>;

/**
 * Parameters for the `mikro-orm` {@link Property} decorators.
 * It is merged with the default values.
 */
export type EntityOption<T> = Partial<
	Record<keyof Omit<ModelAny, ModelPrimaryKey>, PropertyOptions<T>>
>;

/**
 * Creates the common base class entity.
 *
 * @param options for the properties
 * @returns constructed abstract class
 */
export function Entity<T extends ModelWithoutPK>(
	options: EntityOption<T> = {},
): AbstractConstructor<ModelWithoutPK> {
	const { createdAt = {}, updatedAt = [] } = options;

	abstract class EntityCommon implements ModelWithoutPK {
		/** The date when this entity has been created */
		@Property(createdAt)
		public readonly createdAt: Date = new Date();
		/** The date when this entity has been updated */
		@Property(deepmerge({ onUpdate: () => new Date() }, updatedAt))
		public readonly updatedAt: Date = new Date();
	}

	return EntityCommon;
}
