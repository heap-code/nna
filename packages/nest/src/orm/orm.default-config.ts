import { MikroOrmModuleOptions } from "@mikro-orm/nestjs";

/** The default configuration from this `OrmModule` for mikro-orm. */
export const ORM_DEFAULT_CONFIGURATION = {
	// App usage
	autoLoadEntities: true,
	discovery: { disableDynamicFileAccess: true },
	forceUndefined: false,
	strict: true,
	validate: true,
	validateRequired: true,

	// CLI usage
	migrations: { emit: "ts", snapshot: true, snapshotName: "snapshot" },
	seeder: { emit: "ts" },
} as const satisfies MikroOrmModuleOptions;
