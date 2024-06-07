import { Controller } from "@nestjs/common";
import { ControllerFor } from "@nna/nest";
import { UserHttp } from "~/common/user";

@Controller()
export class UserController implements ControllerFor<UserHttp> {}
