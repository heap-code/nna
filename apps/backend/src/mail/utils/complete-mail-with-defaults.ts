import { ISendMailOptions } from "@nestjs-modules/mailer";
import * as HtmlToText from "html-to-text";

import { EnvironmentEmail } from "../../configuration/environments";

/**
 * Completes email data with defaults when they are missing
 *
 * @param sendMailOptions data to complete
 * @param defaults data to set (when missing)
 * @returns complete email data
 */
export function completeMailWithDefaults(
	sendMailOptions: ISendMailOptions,
	defaults: EnvironmentEmail,
): ISendMailOptions {
	if (sendMailOptions.html && !sendMailOptions.text) {
		// Set a default plain-text content from the html one
		return completeMailWithDefaults(
			{
				...sendMailOptions,
				text: HtmlToText.convert(sendMailOptions.html.toString()),
			},
			defaults,
		);
	}

	if (!sendMailOptions.from) {
		return completeMailWithDefaults(
			{ ...sendMailOptions, from: defaults.actors.sender },
			defaults,
		);
	}

	return sendMailOptions;
}
