import { SqliteDriver } from "@mikro-orm/sqlite";
import { Module } from "@nestjs/common";
import { OrmModule as NestOrmModule } from "@nna/nest";
import * as path from "path";

const dbPath = path.join(
	__dirname,
	"..",
	"..",
	"tmp",
	"db.backend-test.sqlite",
);

@Module({
	imports: [
		NestOrmModule.forRoot({
			orm: {
				allowGlobalContext: true,
				dbName: dbPath,
				driver: SqliteDriver,
			},
		}),
	],
})
export class OrmTestingModule {}
