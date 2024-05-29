import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthHttp } from "~/common/auth";

import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller()
export class AuthController implements AuthHttp {
	public constructor(private readonly service: AuthService) {}

	public getProfile(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	public login(body: unknown): Promise<void> {
		throw new Error("Method not implemented.");
	}

	public logout(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	public refresh(body: unknown): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
