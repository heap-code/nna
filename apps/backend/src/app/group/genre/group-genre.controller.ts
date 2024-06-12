import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ControllerFor } from "@nna/nest";
import { GroupGenreHttp } from "~/common/group/genre";

/** Controller for {@link GroupGenreDto group genres} */
@ApiTags("Group genres")
@Controller()
export class GroupGenreController implements ControllerFor<GroupGenreHttp> {}
