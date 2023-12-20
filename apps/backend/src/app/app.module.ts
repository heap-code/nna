import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { GroupModule } from "./group/group.module";
import { UserModule } from "./user/user.module";
import ormConfig from "../orm.config";

@Module({
	imports: [GroupModule, MikroOrmModule.forRoot(ormConfig), UserModule],
})
export class AppModule {}
