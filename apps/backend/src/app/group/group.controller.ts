import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ControllerFor } from "@nna/nest";
import { GroupHttp } from "~/common/group";

/** Controller for [groups]{@link GroupDto} */
@ApiTags("Groups")
@Controller()
export class GroupController implements ControllerFor<GroupHttp> {}
