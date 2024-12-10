import {
	PrimaryKey,
	PrimaryKeyOptions,
	PropertyOptions,
} from "@mikro-orm/core";
import { ModelNumber, ModelPrimaryKey } from "@nna/core";
import { deepmerge } from "deepmerge-ts";
import { AbstractConstructor } from "type-fest";

import * as Common from "./entity.common";

/**
 * The model that this {@link Entity entity constructor} implements.
 */
export type Model = ModelNumber.Type;

/**
 * Parameters for the `mikro-orm` {@link Property} decorators.
 * It is merged with the default values.
 */
export type EntityOptions<T> = Common.EntityOption<T> &
	Partial<Record<ModelPrimaryKey, PrimaryKeyOptions<T>>>;

/**
 * Creates the base class entity.
 *
 * @param options for the properties
 * @returns constructed abstract class
 */
export function Entity<T extends Model>(
	options: EntityOptions<T> = {},
): AbstractConstructor<Model> {
	const { _id = {}, ...common } = options;

	abstract class EntityNumber extends Common.Entity(common) implements Model {
		/** Primary key */
		@PrimaryKey(
			deepmerge(
				{ autoincrement: true } satisfies PropertyOptions<T>,
				_id,
			),
		)
		public readonly _id!: number;
	}

	return EntityNumber;
}
