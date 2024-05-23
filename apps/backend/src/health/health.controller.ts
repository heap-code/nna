import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { HealthCheck } from "@nestjs/terminus";

import { HealthService } from "./health.service";

/** Controller giving server health status */
@ApiTags("Health")
@Controller()
export class HealthController {
	public constructor(private readonly service: HealthService) {}

	/**
	 * Checks the status of the server
	 *
	 * @returns the health status
	 */
	@Get()
	@HealthCheck()
	public check() {
		return this.service.check();
	}
}
