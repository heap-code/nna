import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ControllerFor } from "@nna/nest";
import { UserHttp } from "~/common/user";

/** Controller for {@link UserDto users} */
@ApiTags("Users")
@Controller()
export class UserController implements ControllerFor<UserHttp> {}
