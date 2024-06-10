import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthConfig } from "./auth.config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AUTH_DEFAULT_STRATEGY_NAME, AUTH_STRATEGIES } from "./strategies";
import { UserModule } from "../user/user.module";

@Module({
	controllers: [AuthController],
	exports: [AuthService],
	imports: [
		JwtModule.registerAsync({
			extraProviders: [AuthConfig],
			inject: [AuthConfig],
			useFactory: ({ config, secret }: AuthConfig) => ({
				secret,
				signOptions: { expiresIn: config.duration },
			}),
		}),
		PassportModule.register({
			defaultStrategy: AUTH_DEFAULT_STRATEGY_NAME,
		}),
		UserModule,
	],
	providers: [...AUTH_STRATEGIES, AuthConfig, AuthService],
})
export class AuthModule {}
