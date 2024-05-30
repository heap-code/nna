import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "jsonwebtoken";

import { JWT } from "./jwt";

@Injectable()
export class AuthService {
	public constructor(private readonly jwtService: JwtService) {}

	/**
	 * Validates a given payload
	 *
	 * @param payload the JWT payload to validate
	 * @returns the user if validated
	 */
	public validateJWT(payload: JWT.Payload): Promise<boolean> {
		throw new Error("TODO");
	}

	private async signJwtPayload(payload: JWT.Payload) {
		const token = await this.jwtService.signAsync(payload);
		// These values DOES exist in the payload
		const { exp, iat } =
			this.jwtService.decode<Required<JwtPayload>>(token);

		return {
			emitted_at: new Date(iat * 1000),
			expire_at: new Date(exp * 1000),
			token,
		};
	}
}
