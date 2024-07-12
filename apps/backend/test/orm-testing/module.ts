import { SeedManager } from "@mikro-orm/seeder";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { Module as NModule } from "@nestjs/common";
import { OrmModule as NestOrmModule } from "@nna/nest";
import * as path from "path";

import { DataSeeder } from "./data-seeder";

/** Path to the temp folder (at root). Can help debug some tests */
const TMP_PATH = path.join(__dirname, "..", "..", "..", "..", "tmp", "backend");
const CACHE_DIR = path.join(TMP_PATH, "orm-cache");
const ENTITIES_PATH = path.join(__dirname, "..", "..", "src", "**/*.entity.ts");

@NModule({
	imports: [
		NestOrmModule.forRootAsync({
			useFactory: () => ({
				orm: {
					allowGlobalContext: true,
					autoLoadEntities: false,
					// Avoid error with concurrent access
					dbName: path.join(
						TMP_PATH,
						`db.${process.env["JEST_WORKER_ID"]}.sqlite`,
					),
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
export class Module {}
