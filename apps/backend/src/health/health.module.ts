import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

@Module({
	controllers: [HealthController],
	exports: [HealthService],
	imports: [TerminusModule.forRoot()],
	providers: [HealthService],
})
export class HealthModule {}
