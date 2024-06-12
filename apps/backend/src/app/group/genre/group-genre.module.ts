import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module, forwardRef } from "@nestjs/common";

import { GroupGenreController } from "./group-genre.controller";
import { GroupGenreEntity } from "./group-genre.entity";
import { GroupGenreService } from "./group-genre.service";
import { GroupModule } from "../group.module";

@Module({
	controllers: [GroupGenreController],
	exports: [GroupGenreService],
	imports: [
		forwardRef(() => GroupModule),
		MikroOrmModule.forFeature([GroupGenreEntity]),
	],
	providers: [GroupGenreService],
})
export class GroupGenreModule {}
