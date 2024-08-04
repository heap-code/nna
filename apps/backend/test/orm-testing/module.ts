import { SeedManager } from "@mikro-orm/seeder";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { Module } from "@nestjs/common";
import { OrmModule as NestOrmModule } from "@nna/nest";
import * as inspector from "inspector";
import * as path from "path";

import { DataSeeder } from "./data-seeder";

/** Path to the temp folder (at root). Can help debug some tests */
const TMP_PATH = path.join(
	// Depending on the disk, relying on this too much can make the tests unnecessary long
	__dirname,
	"..",
	"..",
	"..",
	"..",
	"tmp",
	"apps",
	"backend",
);
const CACHE_DIR = path.join(TMP_PATH, "orm-cache");
const ENTITIES_PATH = path.join(__dirname, "..", "..", "src", "**/*.entity.ts");

@Module({
	imports: [
		NestOrmModule.forRootAsync({
			useFactory: () => ({
				orm: {
					allowGlobalContext: true,
					autoLoadEntities: false,
					// Set a file when debugging
					dbName: inspector.url()
						? path.join(TMP_PATH, `db.debug.sqlite`)
						: ":memory:",
					discovery: {
						disableDynamicFileAccess: false,
						requireEntitiesArray: false,
					},
					driver: SqliteDriver,
					// TODO: something better (without "glob loading") ?
					entities: [ENTITIES_PATH],
					entitiesTs: [ENTITIES_PATH],
					extensions: [SeedManager],
					metadataCache: {
						// To fasten the tests with auto-load entities
						enabled: true,
						options: { cacheDir: CACHE_DIR },
					},
				},
			}),
		}),
	],
	providers: [DataSeeder],
})
class OrmTestingModule {}

export { OrmTestingModule as Module };
