import { env } from "./env";
import { authConfig } from "./auth";
import { mailingConfig } from "./mailing";
import { dbConfig } from "./db";

export type AppConfig = {
	env: typeof env,
	auth: typeof authConfig
}

export const appConfig = {
	env: env,
	auth: authConfig,
	mailing: mailingConfig,
	db: dbConfig
}
