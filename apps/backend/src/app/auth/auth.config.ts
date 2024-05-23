import { Injectable } from "@nestjs/common";

import { ConfigurationService } from "../../configuration";

/** A provider that serves specific configuration for the auth module */
@Injectable()
export class AuthConfig {
	/** @returns The auth configuration from the {@link ConfigurationService} */
	public get config() {
		return this.configuration.configuration.auth;
	}

	public constructor(private configuration: ConfigurationService) {}
}
