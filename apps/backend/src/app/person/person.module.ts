import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { PersonController } from "./person.controller";
import { PersonEntity } from "./person.entity";
import { PersonService } from "./person.service";

@Module({
	controllers: [PersonController],
	exports: [PersonService],
	imports: [MikroOrmModule.forFeature([PersonEntity])],
	providers: [PersonService],
})
export class PersonModule {}
