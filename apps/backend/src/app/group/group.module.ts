import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module, forwardRef } from "@nestjs/common";

import { GroupGenreModule } from "./genre/group-genre.module";
import { GroupController } from "./group.controller";
import { GroupEntity } from "./group.entity";
import { GroupService } from "./group.service";

@Module({
	controllers: [GroupController],
	exports: [GroupService],
	imports: [
		forwardRef(() => GroupGenreModule),
		MikroOrmModule.forFeature([GroupEntity]),
	],
	providers: [GroupService],
})
export class GroupModule {}
