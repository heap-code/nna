import { Address } from "@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface";

/** Use a plain string to only get the email or use the object for more information */
export type MailAddress = Address | string;
