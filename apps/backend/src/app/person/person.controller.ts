import { Controller } from "@nestjs/common";
import { ControllerFor } from "@nna/nest";
import { PersonHttp } from "~/common/person";

@Controller()
export class PersonController implements ControllerFor<PersonHttp> {}
