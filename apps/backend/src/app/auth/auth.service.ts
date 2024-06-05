import { NotFoundError } from "@mikro-orm/core";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";

import { JWT } from "./jwt";
import { AuthSession } from "./session";
import { ConfigurationService } from "../../configuration";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";

/** Service for authentication operations */
@Injectable()
export class AuthService {
	/**
	 * Compares the given string against the given hash
	 *
	 * @param clear the string not hashed
	 * @param hash to string hashed
	 * @returns if the 2 string are "equal"
	 */
	public static compare(clear: string, hash: string) {
		return bcryptjs.compare(clear, hash);
	}

	/**
	 * Hashes the given string with a random salt
	 *
	 * @param password the password to hash
	 * @returns the hashed string
	 */
	public static hash(password: string) {
		// Random salt size
		return bcryptjs.hash(password, 10 + Math.round(Math.random() * 3));
	}

	public constructor(
		private readonly configurationService: ConfigurationService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
	) {}

	/**
	 * Looks for an user with the given credentials.
	 * It compares the password with its hashed stored one
	 *
	 * @param username to get the user from
	 * @param password plain password to compare
	 * @returns The found user
	 */
	public async getUserByCredentials(
		username: string,
		password: string,
	): Promise<UserEntity> {
		const user = await this.userService
			.findByUsername(username)
			.catch(async error => {
				// Always run the hash to avoid timed attacks
				await AuthService.compare("", "");
				throw error;
			});

		return AuthService.compare(
			password,
			(await user.password.load()) ?? "",
		).then(equal => {
			if (equal) {
				return user;
			}

			throw new NotFoundError("No user found with the given credentials");
		});
	}

	/**
	 * Creates a JWT Payload for authentication with local credentials.
	 *
	 * @param username of the user
	 * @param password play password of the user
	 * @returns the generated payload and its user
	 */
	public async createJwtPayloadFromCredentials(
		username: string,
		password: string,
	): Promise<[JWT.Payload, UserEntity]> {
		const user = await this.getUserByCredentials(username, password).catch(
			error => {
				throw error instanceof NotFoundError
					? new UnauthorizedException()
					: error;
			},
		);

		return [this.constructJwtPayload({ type: "local" }, user), user];
	}

	/**
	 * Verifies that a given payload is valid.
	 *
	 * @throws {UnauthorizedException} (from the promise) when invalid
	 * @param payload payload to validate
	 * @returns A payload (possibly cleaned)
	 */
	public validateJwtPayload(payload: unknown): Promise<JWT.Payload> {
		const parseResult = JWT.payloadSchema.safeParse(payload);
		if (!parseResult.success) {
			// TODO: It may be wanted to return information(s) about what invalidated the payload
			return Promise.reject(new UnauthorizedException());
		}

		// TODO: check version compatibility, tokens prior to a certain date have been un-validated by the user, ...
		return Promise.resolve(parseResult.data);
	}

	/**
	 * Hydrates a JWT payload into an {@link AuthSession}.
	 *
	 * @param payload the JWT payload to hydrate (supposed to come from a validated session)
	 * @returns The {@link AuthSession} from the {@link JWT.Payload}
	 */
	public hydrateJwt(payload: JWT.Payload): Promise<AuthSession> {
		return Promise.resolve({
			getUser: () => this.userService.findById(payload.userId),
			payload,
		});
	}

	/**
	 * Signs a JWT payload to be send-able to the browser
	 *
	 * @param payload to sign
	 * @returns an object with a JWT token
	 */
	public async signJwtPayload(payload: JWT.Payload) {
		const token = await this.jwtService.signAsync(payload);
		// These values DOES exist in the payload
		// The browser could decode theses, but lets avoid any browser operation for authentication
		const { exp, iat } =
			this.jwtService.decode<Required<JwtPayload>>(token);

		return {
			// * 1000 for JS Dates
			emitted_at: new Date(iat * 1000),
			expire_at: new Date(exp * 1000),
			token,
		};
	}

	private constructJwtPayload(
		source: JWT.PayloadSource,
		user: UserEntity,
	): JWT.Payload {
		return {
			source,
			userId: user._id,
			version: this.configurationService.APP_VERSION,
		};
	}
}
