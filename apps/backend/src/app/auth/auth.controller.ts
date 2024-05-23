import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { authLoginSchema } from "~/common/auth/dtos";

import { useAuth } from "./auth.guard";
import { AuthService } from "./auth.service";

class AuthLoginDto extends createZodDto(extendApi(authLoginSchema)) {}

@ApiTags("Auth")
@Controller()
export class AuthController {
	public constructor(private readonly service: AuthService) {}

	@Post()
	public login(@Body() b: AuthLoginDto) {
		throw new Error("TODO");
	}

	public logout() {
		throw new Error("TODO");
	}

	/** @inheritDoc */
	@Get()
	@useAuth()
	public getProfile() {
		throw new Error("TODO");
	}

	@useAuth()
	public refresh() {
		throw new Error("TODO");
	}
}
