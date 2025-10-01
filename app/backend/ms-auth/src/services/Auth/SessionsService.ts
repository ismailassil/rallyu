import { ISessionFingerprint } from "../../types";
import JWTUtils, { JWT_REFRESH_PAYLOAD } from "../../utils/auth/Auth";
import { SessionExpiredError, SessionRevokedError, SessionNotFoundError, TokenExpiredError, TokenInvalidError } from "../../types/auth.types";
import { AuthConfig } from "../../config/auth";
import SessionsRepository from "../../repositories/SessionsRepository";
import { nowInSeconds } from "../TwoFactorAuth/utils";

class SessionsService {
	constructor(
		private authConfig: AuthConfig,
		private JWTUtils: JWTUtils,
		private sessionRepository: SessionsRepository
	) {}

	async createSession(userID: number, currentSessionFingerprint: ISessionFingerprint) {
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

	async refreshSession(refreshToken: string, newSessionFingerprint: ISessionFingerprint) {
		const { device_name, browser_version, ip_address }: ISessionFingerprint = newSessionFingerprint;

		try {
			const payload: JWT_REFRESH_PAYLOAD = 
				await this.isValidSession(refreshToken, newSessionFingerprint);
	
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
				{
					version: payload.version + 1,
					device_name: device_name,
					browser_version: browser_version,
					ip_address: ip_address
				}
			);
	
			return { newAccessToken, newRefreshToken };
		} catch (err) {
			throw err;
		}
	}

	async revokeSession(refreshToken: string, reason: string, newSessionFingerprint: ISessionFingerprint) {
		try {
			const payload: JWT_REFRESH_PAYLOAD = 
				await this.isValidSession(refreshToken, newSessionFingerprint);
			
			await this.sessionRepository.revoke(payload.session_id, reason);
		} catch (err) {
			throw err;
		}
	}

	async revokeAllSessions(refreshToken: string, reason: string, newSessionFingerprint: ISessionFingerprint) {
		try {
			const payload: JWT_REFRESH_PAYLOAD = 
				await this.isValidSession(refreshToken, newSessionFingerprint);
			
			await this.sessionRepository.revokeAllForUser(payload.sub, reason);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * Validates a session based on the provided refresh token and session fingerprint.
	 * A valid session means that the refresh token is valid (signature) and not expired.
	 * This function does not perform any actions; it only checks and throws errors if validation fails.
	 * It is the caller's responsibility to take actions if errors are thrown.
	 * @param refreshToken - The refresh token to validate.
	 * @param newSessionFingerprint - The fingerprint of the current session (device, browser, IP).
	 * @throws {TokenExpiredError} If the refresh token has expired.
	 * @throws {TokenInvalidError} If the refresh token is invalid.
	 * @throws {SessionNotFoundError} If the session is not found.
	 * @throws {SessionRevokedError} If the session has been revoked or fails security checks.
	 * @throws {SessionExpiredError} If the session has expired.
	 * @returns The decoded payload of the refresh token if the session is valid.
	 */
	private async isValidSession(refreshToken: string, newSessionFingerprint: ISessionFingerprint) {
		const refreshTokenPayload = await this.JWTUtils.verifyRefreshToken(refreshToken);

		const { device_name, browser_version, ip_address }: ISessionFingerprint = newSessionFingerprint;
		const { session_id, version, sub }: JWT_REFRESH_PAYLOAD = refreshTokenPayload;

		const isFound = await this.sessionRepository.findOne(session_id, sub);

		if (!isFound)
			throw new SessionNotFoundError();

		if (isFound.version !== version) 				// RE-USE
			throw new SessionRevokedError('Session revoked for re-use');
		if (isFound.is_revoked)							// EXPIRED
			throw new SessionRevokedError('Session already revoked');
		if (nowInSeconds() > isFound.expires_at)		// EXPIRED
			throw new SessionExpiredError();

		if (!this.authConfig.allowIpChange && isFound.ip_address !== ip_address)					// IP CHANGE
			throw new SessionRevokedError('Session revoked for IP change');
		if (!this.authConfig.allowDeviceChange && isFound.device_name !== device_name)				// DEVICE CHANGE
			throw new SessionRevokedError('Session revoked for device change');
		if (!this.authConfig.allowBrowserChange && isFound.browser_version !== browser_version)		// BROWSER CHANGE
			throw new SessionRevokedError('Session revoked for browser change');

		return this.JWTUtils.decodeJWT<JWT_REFRESH_PAYLOAD>(refreshToken);
	}
}

export default SessionsService;