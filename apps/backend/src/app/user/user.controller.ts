import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ControllerFor } from "@nna/nest";
import { UserHttp } from "~/common/user";

@ApiTags("Users")
@Controller()
export class UserController implements ControllerFor<UserHttp> {}
