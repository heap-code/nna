import type { Options } from "@mikro-orm/core";

export const options: Options = {
	// App usage
	discovery: { disableDynamicFileAccess: true },
	forceUndefined: false,
	strict: true,
	validate: true,

	// CLI usage
	migrations: { emit: "ts", snapshot: true, snapshotName: "snapshot" },
	seeder: { emit: "ts" },
};


