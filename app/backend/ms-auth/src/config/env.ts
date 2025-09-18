import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']),
	PORT: z.coerce.number().int().min(1).max(65535),
	JWT_ACCESS_SECRET: z.string().min(32),
	JWT_REFRESH_SECRET: z.string().min(32),
	JWT_ACCESS_EXP: z.coerce.number().int().min(1).default(60 * 15),			// DEFAULTS TO 15m
	JWT_REFRESH_EXP: z.coerce.number().int().min(1).default(60 * 60 * 24 * 7),	// DEFAULTS TO 7d
	BCRYPT_HASH_ROUNDS: z.coerce.number().int().min(12).max(36).default(12),
	BCRYPT_TIMING_HASH: z.string().min(32),
	MAX_CONCURRENT_SESSION: z.coerce.number().int().min(1).default(5),
	ALLOW_IP_CHANGE: z.boolean(),
	ALLOW_BROWSER_CHANGE: z.boolean(),
	ALLOW_DEVICE_CHANGE: z.boolean(),
	SQLITE3_DB_PATH: z.string()
});

export type Env = z.infer<typeof envSchema>;
export const env: Env = envSchema.parse(process.env);