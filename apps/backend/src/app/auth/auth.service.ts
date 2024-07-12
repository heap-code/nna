import { NotFoundError } from "@mikro-orm/core";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcryptjs from "bcryptjs";
import { AuthSuccess } from "~/common/auth/dtos";

import { JWT } from "./jwt";
import { AuthSession } from "./session";
import { ConfigurationService } from "../../configuration";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";

/** The result of the JWT signature */
export type AuthJwtSignResult = Pick<
	AuthSuccess.Dto,
	"expireOn" | "issuedAt" | "token"
>;

/** Service for authentication features */
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

	/**
	 * Extracts the dates from the JWT payload, usable withing JS.
	 *
	 * @param payload to get the dates from
	 * @returns the date (for JS)
	 */
	public static extractDateRange(
		payload: JWT.PayloadFull,
	): Pick<AuthSuccess.Dto, "expireOn" | "issuedAt"> {
		const { exp, iat } = payload;
		return {
			expireOn: new Date(exp * 1000),
			issuedAt: new Date(iat * 1000),
		};
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
	public validateJwtPayload(payload: unknown): Promise<JWT.PayloadFull> {
		const parseResult = JWT.payloadFullSchema.safeParse(payload);
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
	public hydrateJwt(payload: JWT.PayloadFull): Promise<AuthSession> {
		return Promise.resolve({
			...AuthService.extractDateRange(payload),
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
	public async signJwtPayload(
		payload: JWT.Payload,
	): Promise<AuthJwtSignResult> {
		const token = await this.jwtService.signAsync(
			// To remove the extra data used internally from the JWT payload extends
			JWT.payloadSchema.parse(payload),
		);
		const dates = AuthService.extractDateRange(
			this.jwtService.decode<JWT.PayloadFull>(token),
		);

		return { ...dates, token };
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
