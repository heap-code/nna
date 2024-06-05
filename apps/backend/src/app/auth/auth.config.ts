import { Injectable } from "@nestjs/common";

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
		return { ...this.config.cookie, signed: true };
	}

	/** @returns The secret value for authentication from the {@link ConfigurationService} */
	public get secret() {
		return this.config.secret;
	}

	public constructor(private configuration: ConfigurationService) {}
}
