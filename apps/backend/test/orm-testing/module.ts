import { SeedManager } from "@mikro-orm/seeder";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { Module as NModule } from "@nestjs/common";
import { OrmModule as NestOrmModule } from "@nna/nest";
import * as path from "path";

import { DataSeeder } from "./data-seeder";

/** Path to the test DB. Can help debug some tests */
const dbPath = path.join(
	__dirname,
	"..",
	"..",
	"tmp",
	"db.backend-test.sqlite",
);

@NModule({
	imports: [
		NestOrmModule.forRoot({
			orm: {
				allowGlobalContext: true,
				dbName: dbPath,
				driver: SqliteDriver,
				extensions: [SeedManager],
			},
		}),
	],
	providers: [DataSeeder],
})
export class Module {}
