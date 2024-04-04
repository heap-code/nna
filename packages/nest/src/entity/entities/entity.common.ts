import { DateTimeType, Opt, Property, PropertyOptions } from "@mikro-orm/core";
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
export function Entity<T extends ModelWithoutPK>(options: EntityOption<T>) {
	const { createdAt = {}, updatedAt = {} } = options;

	abstract class EntityCommon implements ModelWithoutPK {
		/** The date when this entity has been created */
		@Property(
			deepmerge(
				{
					onCreate: () => new Date(),
					// "Forces" a readonly field
					onUpdate: ({ createdAt }) => createdAt,
					type: DateTimeType,
				} satisfies PropertyOptions<T>,
				createdAt,
			),
		)
		public readonly createdAt!: Opt<Date>;
		/** The date when this entity has been updated */
		@Property(
			deepmerge(
				{
					onCreate: () => new Date(),
					onUpdate: () => new Date(),
					type: DateTimeType,
				} satisfies PropertyOptions<T>,
				updatedAt,
			),
		)
		public readonly updatedAt!: Opt<Date>;
	}

	return EntityCommon satisfies AbstractConstructor<ModelWithoutPK>;
}
