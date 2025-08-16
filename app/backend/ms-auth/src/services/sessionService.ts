import AuthUtils from "../utils/auth/Auth";
import { ISessionFingerprint } from "../types";
import SessionRepository from "../repositories/sessionRepository";
import JWTUtils, { JWT_REFRESH_PAYLOAD } from "../utils/auth/Auth";
import { SessionExpiredError, SessionRevokedError, SessionNotFoundError } from "../types/auth.types";
import { AuthServiceConfig } from "./authService";

export interface SessionServiceConfig {
	sessionExpiry: string,
	maxConcurrentSessions: number,
	maxSessionFingerprintChange: number,
	allowIpChange: boolean,
	allowBrowserChange: boolean,
	allowDeviceChange: boolean
}

class SessionService {
	// TODO: REMOVE THIS
	private sessionConfig: SessionServiceConfig;

	constructor(
		private authConfig: AuthServiceConfig,
		private JWTUtils: JWTUtils,
		private sessionRepository: SessionRepository
	) {
		this.sessionConfig = {
			sessionExpiry: authConfig.sessionHardExpiry,
			maxConcurrentSessions: authConfig.maxConcurrentSessions,
			maxSessionFingerprintChange: authConfig.maxSessionFingerprintChange,
			allowIpChange: authConfig.allowIpChange,
			allowBrowserChange: authConfig.allowBrowserChange,
			allowDeviceChange: authConfig.allowDeviceChange
		}
	}

	public async createSession(userID: number, currentSessionFingerprint: ISessionFingerprint) {
		const { device_name, browser_version, ip_address }: ISessionFingerprint = currentSessionFingerprint;

		// TODO: EXPIRY SHOULD BE GET FROM SESSION CONFIG
		const { accessToken, refreshToken } = await this.JWTUtils.generateTokenPair(userID, '15m', '7d');
		const { session_id, iat: created_at, sub: user_id }: JWT_REFRESH_PAYLOAD = this.JWTUtils.decodeJWT(refreshToken); // TODO: SIGNATURE CHECK?
		
		// TODO: HARD EXPIRY SHOULD BE GET FROM SESSION CONFIG
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

		return { accessToken, refreshToken };
	}
	
	// BEFORE REFRESHING A SESSION: WE NEED TO CHECK JWT SIGNATURE AND THEN THE CONFIG CHECKS
	public async refreshSession(refreshToken: string, newSessionFingerprint: ISessionFingerprint) {
		const { device_name, browser_version, ip_address }: ISessionFingerprint = newSessionFingerprint;

		// CHECKS (JWT SIGNATURE + EXPIRY && SESSION STATE IN DB)
		await this.validateSession(refreshToken, newSessionFingerprint);

		const payload: JWT_REFRESH_PAYLOAD = this.JWTUtils.decodeJWT(refreshToken);

		// TODO: EXPIRY SHOULD BE GET FROM SESSION CONFIG
		const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.JWTUtils.generateTokenPair(
			payload.sub,
			'15m',
			'7d',
			payload.session_id,
			payload.version + 1
		);

		await this.sessionRepository.update(
			payload.session_id,
			payload.sub,
			{
				version: payload.version + 1,
				device_name: device_name,
				browser_version: browser_version,
				ip_address: ip_address
			}
		);

		return { newAccessToken, newRefreshToken };
	}

	public async revokeSession(refreshToken: string, reason: string, newSessionFingerprint: ISessionFingerprint) {
		const { device_name, browser_version, ip_address }: ISessionFingerprint = newSessionFingerprint; // TODO: DO WE NEED TO CHECK THIS?

		// CHECKS (JWT SIGNATURE + EXPIRY && SESSION STATE IN DB)
		await this.validateSession(refreshToken, newSessionFingerprint);

		const payload: JWT_REFRESH_PAYLOAD = this.JWTUtils.decodeJWT(refreshToken);

		await this.sessionRepository.update(
			payload.session_id,
			payload.sub,
			{
				is_revoked: true,
				reason: reason
			}
		);
	}
	
	// VALID SESSION = VALID JWT + PASSED ALL CONFIG CHECKS
	// SHOULD THIS ACTION PERFORM ACTIONS?
	// FOR JWT ERRORS: WE SHOULD NOT PERFORM ANY ACTIONS, BECAUSE THE JWT MAYBE FALSY AND WE MIGHT HARM SOMEONES SESSION BY REVOKING
	// FOR CONFIG CHECK: WE SHOULD PERFORM ACTIONS
	private async validateSession(refreshToken: string, newSessionFingerprint: ISessionFingerprint) {
		let refreshTokenPayload;
		try {
			refreshTokenPayload = await this.JWTUtils.verifyRefreshToken(refreshToken);
		} catch (err) {
			await this.revokeSession(refreshToken, 'inactivity', newSessionFingerprint); // TODO: CHECK THE REASON
			throw err;
		}

		const { device_name, browser_version, ip_address }: ISessionFingerprint = newSessionFingerprint;
		const { session_id, version, sub: user_id }: JWT_REFRESH_PAYLOAD = refreshTokenPayload;

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

	// public async revokeAllSessions(refreshToken: string, reason: string) {
	// 	const { sub: user_id }: JWT_REFRESH_PAYLOAD = this.JWTUtils.decodeJWT(refreshToken);

	// 	await this.sessionRepository.updateAll(
	// 		user_id,
	// 		{
	// 			is_revoked: true,
	// 			reason: reason
	// 		}
	// 	);
	// }
}

export default SessionService;