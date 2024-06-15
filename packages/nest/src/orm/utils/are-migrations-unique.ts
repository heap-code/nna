import { MigrationObject } from "@mikro-orm/core";

/** @internal */
function getNotUniqueMessage<const T extends string>(name: T) {
	return `The migration '${name}' appears more than 1 time` as const;
}
/**
 * Error message when the migrations are not unique
 *
 * @template NAME of the non-unique migration
 */
export type NotUniqueMessage<NAME extends string> = ReturnType<
	typeof getNotUniqueMessage<NAME>
>;

/** @internal */
type AreMigrationNamesUnique<
	T extends readonly MigrationObject[],
	KNOWN extends string,
> = T extends readonly [
	infer ITEM extends MigrationObject,
	...infer REST extends readonly MigrationObject[],
]
	? // ~= if the name is included in the KNOWN list
		ITEM["name"] extends KNOWN
		? NotUniqueMessage<ITEM["name"]>
		: AreMigrationNamesUnique<REST, ITEM["name"] | KNOWN>
	: // On empty array
		true;

/**
 * Tests that the migrations have unique names.
 *
 * This type definition can fail type-checking when they are not unique.
 *
 * @example
 * //                vvvvvvvvvvvvvvvv  - type error
 * const migrations: MigrationObject[] = areMigrationsUnique([
 * 	{class: Migration, name: "name"},
 * 	{class: Migration, name: "name"},
 * ])
 *
 * @param migrations to tests
 * @returns the migrations when valid or an error message
 */
function areMigrationsUnique<const T extends readonly MigrationObject[]>(
	migrations: T,
): AreMigrationNamesUnique<T, never> extends infer ERROR extends
	NotUniqueMessage<string>
	? ERROR
	: T;
/**
 * Tests that the migrations have unique names.
 *
 * @param migrations to tests
 * @returns the migrations when valid or an error message
 */
function areMigrationsUnique(
	migrations: readonly MigrationObject[],
): MigrationObject[] | NotUniqueMessage<string>;
/**
 * Tests that the migrations have unique names.
 *
 * @param migrations to tests
 * @returns the migrations when valid or an error message
 */
function areMigrationsUnique(
	migrations: readonly MigrationObject[],
): MigrationObject[] | NotUniqueMessage<string> {
	if (migrations.length === 0) {
		return [];
	}

	const [migration, ...rest] = migrations;
	if (rest.some(({ name }) => migration.name === name)) {
		// Stop at the first one found
		return getNotUniqueMessage(migration.name);
	}

	const remains = areMigrationsUnique(rest);
	if (Array.isArray(remains)) {
		return [migration, ...remains];
	}
	return remains;
}

export { areMigrationsUnique };
