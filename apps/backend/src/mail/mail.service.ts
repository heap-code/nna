import { Inject, Injectable } from "@nestjs/common";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";

import * as Utils from "./utils";
import { ConfigurationService } from "../configuration";

/** Service to send email. It sets some defaults value */
@Injectable()
export class MailService extends MailerService {
	@Inject(ConfigurationService)
	private readonly configurationService!: ConfigurationService;

	/** @returns the email configuration */
	private get config() {
		return this.configurationService.configuration.email;
	}

	/** @inheritDoc */
	public override sendMail(sendMailOptions: ISendMailOptions) {
		return super.sendMail(
			Utils.completeMailWithDefaults(sendMailOptions, this.config),
		);
	}
}
