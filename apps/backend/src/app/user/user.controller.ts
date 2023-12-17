import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { userSchema } from "~/common/user";

class UserDTO extends createZodDto(extendApi(userSchema)) {}

@Controller("user")
export class UserController {
	@Get("123")
	public getIBe(): UserDTO {
		return {
			_id: 1,
			create_at: new Date(),
			email: "asd",
			update_at: new Date(),
		};
	}

	@Post("asd")
	public dd(@Body() a: UserDTO) {
		return [1, 2];
	}
}
