import { env } from "./env";
import { authConfig } from "./auth";
import { dbConfig } from "./db";

export type AppConfig = {
	env: typeof env,
	auth: typeof authConfig
}

export const appConfig = {
	env: env,
	auth: authConfig,
	db: dbConfig
}
