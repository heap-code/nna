import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Module } from "@nestjs/common";

import { GroupModule } from "./group/group.module";
import { UserModule } from "./user/user.module";
import { OrmModule } from "../orm/orm.module";

@Module({
	imports: [
		GroupModule,
		OrmModule.forRoot({
			orm: {
				connect: false,
				dbName: "nna",
				driver: PostgreSqlDriver,

				// TODO: from a ConfigService
			},
		}),
		UserModule,
	],
})
export class AppModule {}
