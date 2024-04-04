import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { GroupController } from "./group.controller";
import { GroupEntity } from "./group.entity";
import { GroupService } from "./group.service";

@Module({
	controllers: [GroupController],
	exports: [GroupService],
	imports: [MikroOrmModule.forFeature([GroupEntity])],
	providers: [GroupService],
})
export class GroupModule {}
