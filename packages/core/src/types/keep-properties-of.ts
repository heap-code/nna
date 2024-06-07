/**
 * Keep from an object all properties that extends a given type.
 *
 * @template T object to keep some properties from
 * @template P type the fields to keep
 */
export type KeepPropertiesOf<T extends object, P> = {
	[K in keyof T as T[K] extends P ? K : never]: T[K];
};
