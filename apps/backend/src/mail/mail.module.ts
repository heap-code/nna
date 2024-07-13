import { Module, Provider } from "@nestjs/common";
import { MailerModule, MailerService } from "@nestjs-modules/mailer";

import { MailService } from "./mail.service";
import { ConfigurationService } from "../configuration";

/** The default mailer is available, but this make {@link MailService} works like a synonym */
const providers: Provider[] = [
	{ provide: MailService, useExisting: MailerService },
];

/**
 * Module for mail interaction.
 * To import in each module that requires it (simplify dependency)
 *
 * Prefer {@link MailService} over {@link MailerService} (even if they both work)
 *
 * On tests, override the {@link MailerService} with (as example): ```
 * module = await Test.createTestingModule({})
 * 	.overrideProvider(MailerService)
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
	extraProviders: [{ provide: MailerService, useClass: MailService }],
	inject: [ConfigurationService],
	useFactory: ({ configuration }: ConfigurationService) => ({
		transport: configuration.email.transport,
		verifyTransporters: true,
	}),
});
