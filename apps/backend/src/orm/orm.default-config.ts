import { MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import path from "path";

import { MIGRATIONS } from "./migrations";

const pathMigrations = path.join(__dirname, "migrations");
const pathSeeders = path.join(__dirname, "seeders");

/** The default configuration from this `OrmModule` for mikro-orm. */
export const ORM_DEFAULT_CONFIGURATION = {
	driver: PostgreSqlDriver,

	// The paths will be incorrect once builded
	// as it is desired that the CLI is no usable on the compiled code
	migrations: { migrationsList: MIGRATIONS.slice(), pathTs: pathMigrations },
	seeder: { pathTs: pathSeeders },
} as const satisfies MikroOrmModuleOptions;
