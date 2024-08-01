import { Injectable } from "@nestjs/common";
import { CookieOptions } from "express";

import { ConfigurationService } from "../../configuration";

/** A provider that serves specific configuration for the auth module */
@Injectable()
export class AuthConfig {
	/** @returns The auth configuration from the {@link ConfigurationService} */
	public get config() {
		return this.configuration.configuration.auth;
	}

	/** @returns The cookie configuration from the {@link ConfigurationService} */
	public get cookie() {
		return this.config.cookie;
	}

	/** @returns The secret value for authentication from the {@link ConfigurationService} */
	public get secret() {
		return this.config.secret;
	}

	public constructor(private configuration: ConfigurationService) {}

	/**
	 * Get default values for cookie options
	 *
	 * @returns cookie options
	 */
	public getCookieOptions() {
		const { secure, signed } = this.cookie;

		return {
			httpOnly: true,
			// TODO: may need to change with HTTPS
			sameSite: "none",
			secure,
			signed,
		} satisfies CookieOptions;
	}
}
