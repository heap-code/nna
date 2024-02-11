import { Module } from "@nestjs/common";

import { GroupController } from "./group.controller";
import { GroupService } from "./group.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { GroupEntity } from "./group.entity";

@Module({
	controllers: [GroupController],
	imports: [MikroOrmModule.forFeature([GroupEntity])],
	providers: [GroupService],
})
export class GroupModule {}
