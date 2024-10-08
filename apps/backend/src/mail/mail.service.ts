import { inline } from "@css-inline/css-inline";
import { Injectable } from "@nestjs/common";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";

import * as Utils from "./utils";
import { ConfigurationService } from "../configuration";

/** Service to send email. It sets some defaults value */
@Injectable()
export class MailService {
	/** @returns the email configuration */
	public get config() {
		return this.configurationService.configuration.email;
	}

	public constructor(
		private readonly configurationService: ConfigurationService,
		private readonly mailerService: MailerService,
	) {}

	/**
	 * Sends an email
	 *
	 * @param sendMailOptions to send an email
	 * @returns information of the sent email
	 */
	public sendMail(sendMailOptions: ISendMailOptions) {
		const { html, ...options } = Utils.completeMailWithDefaults(
			sendMailOptions,
			this.config,
		);
		return this.mailerService.sendMail({
			...options,
			html: html && inline(html.toString()),
		});
	}
}
