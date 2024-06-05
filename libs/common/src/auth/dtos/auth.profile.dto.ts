import { AuthSuccessDto } from "./auth.success.dto";

export interface AuthProfileDto
	extends Pick<AuthSuccessDto, "emitted_at" | "expire_at"> {
	// TODO
	id: number;
}
