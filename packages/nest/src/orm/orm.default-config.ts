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

	// CLI usage (the migrations can also be used programmatically)
	migrations: {
		emit: "ts",
		snapshot: true,
		snapshotName: "snapshot",
		tableName: "_orm_migrations_",
	},
	seeder: { emit: "ts" },
} as const satisfies MikroOrmModuleOptions;
