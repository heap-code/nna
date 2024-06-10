import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ControllerFor } from "@nna/nest";
import { PersonHttp } from "~/common/person";

/** Controller for [persons]{@link PersonDto} */
@ApiTags("Persons")
@Controller()
export class PersonController implements ControllerFor<PersonHttp> {}
