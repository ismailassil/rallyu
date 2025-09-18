import { env } from "./env";

export type AuthConfig = {
	accessSecret: string;
	refreshSecret: string;
	accessExpires: number;		// IN SECONDS
	refreshExpires: number;		// IN SECONDS
	maxConcurrentSessions: number;
	allowIpChange: boolean;
	allowBrowserChange: boolean;
	allowDeviceChange: boolean;
}

export const authConfig: AuthConfig = {
	accessSecret: env.JWT_ACCESS_SECRET,
	refreshSecret: env.JWT_REFRESH_SECRET,
	accessExpires: env.JWT_ACCESS_EXP,
	refreshExpires: env.JWT_REFRESH_EXP,
	maxConcurrentSessions: env.MAX_CONCURRENT_SESSION,
	allowIpChange: env.ALLOW_IP_CHANGE,
	allowBrowserChange: env.ALLOW_BROWSER_CHANGE,
	allowDeviceChange: env.ALLOW_DEVICE_CHANGE
}