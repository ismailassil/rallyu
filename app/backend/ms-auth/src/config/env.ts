import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'dev']),
	PORT: z.coerce.number().int().min(1).max(65535),
	API_KEY: z.string().min(1),
	JWT_ACCESS_SECRET: z.string().min(32),
	JWT_REFRESH_SECRET: z.string().min(32),
	JWT_ACCESS_EXP: z.coerce.number().int().min(1).default(60 * 15),			// DEFAULTS TO 15m
	JWT_REFRESH_EXP: z.coerce.number().int().min(1).default(60 * 60 * 24 * 7),	// DEFAULTS TO 7d
	BCRYPT_HASH_ROUNDS: z.coerce.number().int().min(12).max(36).default(12),
	BCRYPT_TIMING_HASH: z.string().min(32),
	MAX_CONCURRENT_SESSION: z.coerce.number().int().min(1).default(5),
	ALLOW_IP_CHANGE: z.coerce.boolean(),
	ALLOW_BROWSER_CHANGE: z.coerce.boolean(),
	ALLOW_DEVICE_CHANGE: z.coerce.boolean(),
	MAILING_SERVICE_PROVIDER: z.string(),
	MAILING_SERVICE_USER: z.string(),
	MAILING_SERVICE_PASS: z.string(),
	SQLITE3_DB_PATH: z.string(),
	GOOGLE_OAUTH_CLIENT_ID: z.string(),
	GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
	GOOGLE_OAUTH_AUTH_URI: z.string(),
	GOOGLE_OAUTH_REDIRECT_URI: z.string(),
	GOOGLE_OAUTH_EXCHANGE_URI: z.string(),
	INTRA42_OAUTH_CLIENT_ID: z.string(),
	INTRA42_OAUTH_CLIENT_SECRET: z.string(),
	INTRA42_OAUTH_AUTH_URI: z.string(),
	INTRA42_OAUTH_REDIRECT_URI: z.string(),
	INTRA42_OAUTH_EXCHANGE_URI: z.string(),
	INTRA42_API_URI: z.string()
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
	env = envSchema.parse(process.env);
} catch (err) {
	if (err instanceof z.ZodError) {
		console.error("ENV VARS VALIDATION ERROR:");
		for (const issue of err.issues) {
			console.error(`- ${issue.path.join(".") || "(root)"}: ${issue.message}`);
		}
	} else {
		console.error(err);
	}
	process.exit(1);
}

export { env };
