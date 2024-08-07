import { UnderscoreNamingStrategy } from "@mikro-orm/core";
import { MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import kebabCase from "just-kebab-case";

/** @internal */
class NamingStrategy extends UnderscoreNamingStrategy {
	public override classToTableName(entityName: string): string {
		const tableName = super.classToTableName(entityName);

		// Remove the suffix on classes (e.g. UserEntity)
		const suffix = "_entity";
		return tableName.endsWith(suffix)
			? tableName.slice(0, -suffix.length)
			: tableName;
	}
}

/** @internal */
const ormSeederSuffix = "Seeder";
/** @internal */
const seederSuffix = "seeder";

/** The default configuration from this `OrmModule` for mikro-orm. */
export const ORM_DEFAULT_CONFIGURATION = {
	// App usage
	autoLoadEntities: true,
	discovery: { disableDynamicFileAccess: true, requireEntitiesArray: true },
	forceUndefined: false,
	ignoreUndefinedInQuery: true,
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
		fileName: className => {
			const name = className.endsWith(ormSeederSuffix)
				? // Remove default suffix from the ORM
					className.slice(0, -ormSeederSuffix.length)
				: className;

			return `${kebabCase(name)}.${seederSuffix}`;
		},
	},
	serialization: { forceObject: true },
} as const satisfies MikroOrmModuleOptions;
