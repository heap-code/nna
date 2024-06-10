import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ControllerFor } from "@nna/nest";
import { PersonHttp } from "~/common/person";

@ApiTags("Persons")
@Controller()
export class PersonController implements ControllerFor<PersonHttp> {}
