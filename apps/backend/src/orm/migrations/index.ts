import { OrmUtils } from "@nna/nest";

/** List of known migrations.*/
export const MIGRATIONS = OrmUtils.areMigrationsUnique([
	// !!! NEVER change the names of existing migration !!! Or they will be ran again
]);
