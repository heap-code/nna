import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AuthConfig } from "./auth.config";

@Injectable()
export class AuthService {
	public constructor(
		public readonly config: AuthConfig,
		private readonly jwtService: JwtService,
	) {}

	/**
	 * Validates a given payload
	 *
	 * @param payload the JWT payload to validate
	 * @returns the user if validated
	 */
	public validateJWT(payload: unknown): Promise<boolean> {
		throw new Error("TODO");
	}
}
