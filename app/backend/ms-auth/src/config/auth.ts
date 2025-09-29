import { env } from "./env";
import { mailingConfig, MailingConfig } from "./mailing";

export type AuthConfig = {
	accessSecret: string;
	refreshSecret: string;
	accessExpires: number;		// IN SECONDS
	refreshExpires: number;		// IN SECONDS
	bcryptHashRounds: number;
	bcryptTimingHash: string;
	maxConcurrentSessions: number;
	allowIpChange: boolean;
	allowBrowserChange: boolean;
	allowDeviceChange: boolean;
	mailingConfig: MailingConfig;
}

export const authConfig: AuthConfig = {
	accessSecret: env.JWT_ACCESS_SECRET,
	refreshSecret: env.JWT_REFRESH_SECRET,
	accessExpires: env.JWT_ACCESS_EXP,
	refreshExpires: env.JWT_REFRESH_EXP,
	bcryptHashRounds: env.BCRYPT_HASH_ROUNDS,
	bcryptTimingHash: env.BCRYPT_TIMING_HASH,
	maxConcurrentSessions: env.MAX_CONCURRENT_SESSION,
	allowIpChange: env.ALLOW_IP_CHANGE,
	allowBrowserChange: env.ALLOW_BROWSER_CHANGE,
	allowDeviceChange: env.ALLOW_DEVICE_CHANGE,
	mailingConfig: mailingConfig
}