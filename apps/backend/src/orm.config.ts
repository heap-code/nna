import { defineConfig } from "@mikro-orm/postgresql";

import { UserEntity } from "./app/user/user.entity";

export const ormConfig = defineConfig({
	// Configuration
	dbName: "nna",
	host: "127.0.0.1",
	password: "DEV_PASSWORD",
	port: 5432,
	user: "nna",

	// App usage
	discovery: { disableDynamicFileAccess: true },
	entities: [UserEntity],
	forceUndefined: false,
	strict: true,
	validate: true,

	// CLI usage
	migrations: { emit: "ts", snapshot: true, snapshotName: "snapshot" },
	seeder: { emit: "ts" },
});

export default ormConfig;
