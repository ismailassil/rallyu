import AuthUtils from "../utils/auth/Auth";
import { ISessionFingerprint } from "../types";
import SessionRepository from "../repositories/sessionRepository";
import { JWT_REFRESH_PAYLOAD } from "../utils/auth/Auth";
import { SessionExpiredError, SessionRevokedError, SessionNotFoundError } from "../types/auth.types";
import { AuthConfig } from "./authService";

export interface SessionConfig {
	sessionExpiry: string,
	maxConcurrentSessions: number,
	maxSessionFingerprintChange: number,
	allowIpChange: boolean,
	allowBrowserChange: boolean,
	allowDeviceChange: boolean
}

class SessionManager {
	private authUtils: AuthUtils;
	private sessionRepository: SessionRepository;
	private sessionConfig: SessionConfig;

	constructor(authConfig: AuthConfig) {
		this.authUtils = new AuthUtils();
		this.sessionRepository = new SessionRepository();
		this.sessionConfig = {
			sessionExpiry: authConfig.sessionHardExpiry,
			maxConcurrentSessions: authConfig.maxConcurrentSessions,
			maxSessionFingerprintChange: authConfig.maxSessionFingerprintChange,
			allowIpChange: authConfig.allowIpChange,
			allowBrowserChange: authConfig.allowBrowserChange,
			allowDeviceChange: authConfig.allowDeviceChange
		}
	}

	public async createSession(refreshToken: string, currentSessionFingerprint: ISessionFingerprint) {
		const { device_name, browser_version, ip_address }: ISessionFingerprint = currentSessionFingerprint;
		const { session_id, iat: created_at, sub: user_id }: JWT_REFRESH_PAYLOAD = this.authUtils.decodeJWT(refreshToken);
		
		const expires_at = Math.floor((Date.now() / 1000) + (60 * 60 * 24 * 30)); // 30d
		
		await this.sessionRepository.create(
			session_id,
			device_name,
			browser_version,
			ip_address,
			created_at,
			expires_at,
			user_id
		);
	}
	
	public async refreshSession(newRefreshToken: string, newSessionFingerprint: ISessionFingerprint) {
		const { device_name, browser_version, ip_address }: ISessionFingerprint = newSessionFingerprint;
		const { session_id, version, sub: user_id }: JWT_REFRESH_PAYLOAD = this.authUtils.decodeJWT(newRefreshToken);
		
		const isFound = await this.sessionRepository.findOne(session_id, user_id);

		if (isFound === null)
			throw new SessionNotFoundError();
		
		await this.sessionRepository.update(
			session_id,
			user_id,
			{
				version: version,
				device_name: device_name,
				browser_version: browser_version,
				ip_address: ip_address
			}
		);
	}
	
	public async validateSession(refreshToken: string, newSessionFingerprint: ISessionFingerprint) {
		const { device_name, browser_version, ip_address }: ISessionFingerprint = newSessionFingerprint;
		const { session_id, version, sub: user_id }: JWT_REFRESH_PAYLOAD = this.authUtils.decodeJWT(refreshToken);

		const isFound = await this.sessionRepository.findOne(session_id, user_id);
		console.log('New Session: ');
		console.log(newSessionFingerprint);
		console.log('DB Session: ');
		console.log(isFound);

		if (isFound === null) // CLEANED
			throw new SessionNotFoundError();

		if (isFound.version !== version) 				// RE-USE
			throw new SessionRevokedError('Session revoked for re-use');
		if (isFound.is_revoked)							// EXPIRED
			throw new SessionRevokedError('Session revoked for already revoked');
		if ((Date.now() / 1000) > isFound.expires_at)	// EXPIRED
			throw new SessionExpiredError('Session revoked for expiration');

		if (!this.sessionConfig.allowIpChange && isFound.ip_address !== ip_address)					// IP CHANGE
			throw new SessionRevokedError('Session revoked for ip change');
		if (!this.sessionConfig.allowDeviceChange && isFound.device_name !== device_name)			// DEVICE CHANGE
			throw new SessionRevokedError('Session revoked for device change');
		if (!this.sessionConfig.allowBrowserChange && isFound.browser_version !== browser_version)	// BROWSER CHANGE
			throw new SessionRevokedError('Session revoked for browser change');
	}

	public async revokeSession(refreshToken: string, reason: string) {
		const { session_id, sub: user_id }: JWT_REFRESH_PAYLOAD = this.authUtils.decodeJWT(refreshToken);

		await this.sessionRepository.update(
			session_id,
			user_id,
			{
				is_revoked: true,
				reason: reason
			}
		);
	}

	public async revokeAllSessions(refreshToken: string, reason: string) {
		const { sub: user_id }: JWT_REFRESH_PAYLOAD = this.authUtils.decodeJWT(refreshToken);

		await this.sessionRepository.updateAll(
			user_id,
			{
				is_revoked: true,
				reason: reason
			}
		);
	}
}

export default SessionManager;