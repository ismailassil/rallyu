import { ISessionFingerprint } from "../../types";
import JWTUtils, { JWT_REFRESH_PAYLOAD } from "../../utils/auth/Auth";
import { AuthConfig } from "../../config/auth";
import SessionsRepository from "../../repositories/SessionsRepository";
import { nowInSeconds } from "../TwoFactorAuth/utils";
import { SessionExpiredError, SessionNotFoundError, SessionRevokedError, TokenInvalidError } from "../../types/exceptions/auth.exceptions";

class SessionsService {
	constructor(
		private authConfig: AuthConfig,
		private JWTUtils: JWTUtils,
		private sessionRepository: SessionsRepository
	) {}

	async createSession(userID: number, newSessionFingerprint: ISessionFingerprint) {
		await this.sessionRepository.deleteExpired();
		const { device, browser, ip_address }: ISessionFingerprint = newSessionFingerprint;

		// TODO: EXPIRY SHOULD BE GET FROM SESSION CONFIG
		const { accessToken, refreshToken } = await this.JWTUtils.generateTokenPair(userID, '15m', '7d');
		const { session_id, iat: created_at, sub: user_id }: JWT_REFRESH_PAYLOAD = this.JWTUtils.decodeJWT(refreshToken); // TODO: SIGNATURE CHECK?

		const activeSessionCount = await this.sessionRepository.countActiveSessions(userID);
		if (activeSessionCount >= this.authConfig.maxConcurrentSessions) {
			// REVOKE OLDEST SESSION
			const sessionToRevoke = await this.sessionRepository.findOldestActiveSession(
				userID
			);
			if (sessionToRevoke)
				await this.sessionRepository.revoke(sessionToRevoke.session_id, 'Maximum active sessions exceeded');
		}

		// TODO: HARD EXPIRY SHOULD BE GET FROM SESSION CONFIG
		const expires_at = Math.floor((Date.now() / 1000) + (60 * 60 * 24 * 30)); // 30d

		await this.sessionRepository.create(
			session_id,
			device,
			browser,
			ip_address,
			created_at,
			expires_at,
			user_id
		);

		return { accessToken, refreshToken };
	}

	async refreshSession(refreshToken: string, thisSessionFingerprint: ISessionFingerprint) {
		const { device, browser, ip_address }: ISessionFingerprint = thisSessionFingerprint;

		try {
			const payload: JWT_REFRESH_PAYLOAD =
				await this.isValidSession(refreshToken, thisSessionFingerprint);

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
					device: device,
					browser: browser,
					ip_address: ip_address
				}
			);

			return { newAccessToken, newRefreshToken };
		} catch (err) {
			throw err;
		}
	}

	async revokeSession(session_id: string, reason: string, userID: number, refreshToken?: string) {
		if (refreshToken) {
			try {
				await this.isValidSession(refreshToken, { device: '', browser: '', ip_address: '' });
			} catch (err) {
				if (err instanceof TokenInvalidError)
					throw err;
			}
		}

		const isFound = await this.sessionRepository.findOne(session_id, userID);
		if (!isFound)
			throw new SessionNotFoundError();

		await this.sessionRepository.revoke(session_id, reason);
	}

	async revokeAllSessions(reason: string, userID: number, refreshToken?: string) {
		if (refreshToken) {
			try {
				const payload = await this.isValidSession(refreshToken, { device: '', browser: '', ip_address: '' });

				const currentSession = payload.session_id;

				await this.sessionRepository.revokeAllForUser(userID, reason, currentSession);

				return;
			} catch (err) {
				if (err instanceof TokenInvalidError)
					throw err;
			}
		}
		await this.sessionRepository.revokeAllForUser(userID, reason);
	}

	async getActiveSessions(userID: number, refreshToken?: string) {
		try {
			const payload = refreshToken ? await this.JWTUtils.verifyRefreshToken(refreshToken) : null;

			const sessions = await this.sessionRepository.findAllActive(userID);

			return sessions.map(session => ({ ...session, is_current: payload ? session.session_id === payload.session_id : false }));
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

		const { device, browser, ip_address }: ISessionFingerprint = newSessionFingerprint;
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
		if (!this.authConfig.allowDeviceChange && isFound.device !== device)						// DEVICE CHANGE
			throw new SessionRevokedError('Session revoked for device change');
		if (!this.authConfig.allowBrowserChange && isFound.browser !== browser)						// BROWSER CHANGE
			throw new SessionRevokedError('Session revoked for browser change');

		return this.JWTUtils.decodeJWT<JWT_REFRESH_PAYLOAD>(refreshToken);
	}
}

export default SessionsService;
