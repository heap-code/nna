import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Module({
	controllers: [UserController],
	imports: [MikroOrmModule.forFeature([UserEntity])],
	providers: [UserService],
})
export class UserModule {}
