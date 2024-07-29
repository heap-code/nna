import { Module, Provider } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";

import { MailService } from "./mail.service";
import { ConfigurationService } from "../configuration";

/** Imported and exported providers */
const providers: Provider[] = [MailService];

/**
 * Module for mail interaction.
 * To import in each module that requires it (simplify dependency)
 *
 * On tests, override the {@link MailService} with (as example): ```
 * module = await Test.createTestingModule({})
 * 	.overrideProvider(MailService)
 * 	.useValue({ sendMail: jest.fn() })
 * 	.compile();
 * ```
 */
@Module({
	exports: providers,
	imports: [
		// This should be overridden in `AppModule` (and can also be overridden in tests)
		MailerModule.forRoot({
			transport: { url: "" },
			verifyTransporters: false,
		}),
	],
	providers,
})
export class MailModule {}

/** The module to apply in the AppModule (to overwrite the configuration) */
export const AppMailerModule = MailerModule.forRootAsync({
	inject: [ConfigurationService],
	useFactory: ({ configuration }: ConfigurationService) => ({
		transport: configuration.email.transport,
		verifyTransporters: true,
	}),
});
