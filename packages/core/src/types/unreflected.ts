/**
 * Wrapper type used to circumvent ESM modules circular dependency issue
 * caused by reflection metadata saving the type of the property (error with SWC).
 *
 * Either use this type (example 1) or import `type` it (example 2).
 *
 * @see https://docs.nestjs.com/recipes/swc#common-pitfalls
 * @example
 * import { EntityB } from "somewhere";
 * class EntityA {
 * 	\@ManyToOne(() => EntityB)
 * 	public b!: EntityB;
 * }
 * @example
 * import { EntityB } from "somewhere";
 * import type { EntityB as EntityBType } from "somewhere";
 * class EntityA {
 * 	\@ManyToOne(() => EntityB)
 * 	public b!: EntityBType;
 * }
 */
export type Unreflected<T> = T;
