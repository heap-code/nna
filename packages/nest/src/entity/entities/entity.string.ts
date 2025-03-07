import { PrimaryKey, PrimaryKeyOptions } from "@mikro-orm/core";
import { ModelString, ModelPrimaryKey } from "@nna/core";
import { AbstractConstructor } from "type-fest";

import * as Common from "./entity.common";

/**
 * The model that this {@link Entity entity constructor} implements.
 */
export type Model = ModelString.Type;

/**
 * Parameters for the `mikro-orm` {@link Property} decorators.
 * It is merged with the default values.
 */
export type EntityOptions<T> = Common.EntityOption<T> &
	Record<ModelPrimaryKey, PrimaryKeyOptions<T>>;

/**
 * Creates the base class entity.
 *
 * For string id, a `onCreate` method must be set.
 *
 * @example
 * class MyEntity extends EntityString.Entity({_id:{ onCreate: () => Date.now().toString()}})
 * @param options for the properties
 * @returns constructed abstract class
 */
export function Entity<T extends Model>(
	options: EntityOptions<T>,
): AbstractConstructor<Model> {
	const { _id, ...common } = options;

	abstract class EntityString extends Common.Entity(common) implements Model {
		/** Primary key */
		@PrimaryKey(_id)
		public readonly _id!: string;
	}

	return EntityString;
}
