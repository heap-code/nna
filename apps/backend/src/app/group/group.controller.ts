import { Controller } from "@nestjs/common";
import { ControllerFor } from "@nna/nest";
import { GroupHttp } from "~/common/group";

@Controller()
export class GroupController implements ControllerFor<GroupHttp> {}
