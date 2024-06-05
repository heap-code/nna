import { UnderscoreNamingStrategy } from "@mikro-orm/core";
import { MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import kebabCase from "just-kebab-case";

/** @internal */
class NamingStrategy extends UnderscoreNamingStrategy {
	public override classToTableName(entityName: string): string {
		const tableName = super.classToTableName(entityName);

		const suffix = "_entity";
		return tableName.endsWith(suffix)
			? tableName.slice(0, -suffix.length)
			: tableName;
	}
}

/** @internal */
const seederSuffix = "seeder";

/** The default configuration from this `OrmModule` for mikro-orm. */
export const ORM_DEFAULT_CONFIGURATION = {
	// App usage
	autoLoadEntities: true,
	discovery: { disableDynamicFileAccess: true },
	forceUndefined: false,
	namingStrategy: NamingStrategy,
	strict: true,
	validate: true,
	validateRequired: true,

	// CLI usage (the migrations can also be used programmatically)
	migrations: {
		emit: "ts",
		fileName: (timestamp: string, name?: string) =>
			`${timestamp}${name ? `.${kebabCase(name)}` : ""}.migration`,
		snapshot: true,
		snapshotName: "snapshot",
		tableName: "_orm_migrations_",
	},
	seeder: {
		emit: "ts",
		fileName: className =>
			`${kebabCase(className).slice(0, -seederSuffix.length - 1)}.${seederSuffix}`,
	},
} as const satisfies MikroOrmModuleOptions;
