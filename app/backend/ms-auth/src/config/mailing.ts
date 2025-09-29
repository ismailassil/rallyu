import { env } from "./env";

export type MailingConfig = {
	mailingServiceProvider: string;
	mailingServiceUser: string;
	mailingServicePassword: string;
}

export const mailingConfig = {
	mailingServiceProvider: env.MAILING_SERVICE_PROVIDER,
	mailingServiceUser: env.MAILING_SERVICE_USER,
	mailingServicePassword: env.MAILING_SERVICE_PASS
}
