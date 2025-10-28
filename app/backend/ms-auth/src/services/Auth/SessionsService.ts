import { ISessionFingerprint } from "../../types";
import JWTUtils, { JWT_REFRESH_PAYLOAD } from "../../utils/auth/JWTUtils";
import { AuthConfig } from "../../config/auth";
import SessionsRepository from "../../repositories/SessionsRepository";
import { UnauthorizedError } from "../../types/exceptions/AAuthError";
import logger from "../../utils/misc/logger";
const geoip = require('geoip-lite');

class SessionsService {
	constructor(
		private authConfig: AuthConfig,
		private JWTUtils: JWTUtils,
		private sessionRepository: SessionsRepository
	) {}

	async createSession(userID: number, { device, browser, ip_address }: ISessionFingerprint) {
		await this.sessionRepository.deleteExpired();

		const { accessToken, refreshToken } = await this.JWTUtils.generateTokenPair(userID);

		const { session_id, sub, iat, exp } = this.JWTUtils.decodeJWT<JWT_REFRESH_PAYLOAD>(refreshToken);

		const activeSessionCount = await this.sessionRepository.countActiveSessions(userID);
		if (activeSessionCount >= this.authConfig.maxConcurrentSessions) {
			// REVOKE OLDEST SESSION
			const sessionToRevoke = await this.sessionRepository.findOldestActiveSession(
				userID
			);
			if (sessionToRevoke)
				await this.sessionRepository.revoke(sessionToRevoke.session_id, 'Maximum active sessions exceeded');
		}

		await this.sessionRepository.create(
			session_id,
			device,
			browser,
			ip_address,
			iat,
			exp,
			sub
		);

		return { accessToken, refreshToken };
	}

	private async isValidSession({ sub, session_id, version, iat, exp }: JWT_REFRESH_PAYLOAD & { iat: number, exp: number }, { device, browser, ip_address }: ISessionFingerprint) {
		const session = await this.sessionRepository.findOne(session_id, sub);
		if (!session || session.is_revoked)
			throw new UnauthorizedError();

		const strictChecks: [boolean, string][] = [
			[session.version !== version, 'Revoked for re-use'],													// RE-USE
			[!this.authConfig.allowIpChange && session.ip_address !== ip_address, 'Revoked for IP change'],			// IP CHANGE
			[!this.authConfig.allowDeviceChange && session.device !== device, 'Revoked for device change'],			// DEVICE CHANGE
			[!this.authConfig.allowBrowserChange && session.browser !== browser, 'Revoked for browser change']		// BROWSER CHANGE
		];

		for (const [condition, revokeReason] of strictChecks) {
			if (condition) {
				await this.sessionRepository.revoke(session_id, revokeReason);
				throw new UnauthorizedError();
			}
		}
	}

	async refreshSession(refreshTokenPayload: JWT_REFRESH_PAYLOAD & { iat: number, exp: number }, newFingerprint: ISessionFingerprint) {
		// ENFORCE VALID SESSION
		await this.isValidSession(refreshTokenPayload, newFingerprint);

		const { sub, session_id, version } = refreshTokenPayload;
		const { accessToken: newAccessToken, refreshToken: rotatedRefreshToken } = await this.JWTUtils.generateTokenPair(
			sub,
			session_id,
			version + 1
		);

		const { device, ip_address, browser } = newFingerprint;
		await this.sessionRepository.update(session_id, {
			version: version + 1,
			device,
			ip_address,
			browser
		});

		return { newAccessToken, rotatedRefreshToken };
	}

	async revokeSession(session_id: string, sub: number, reason: string) {
		const session = await this.sessionRepository.findOne(session_id, sub);
		if (!session)
			return ;

		await this.sessionRepository.revoke(session_id, reason);
	}

	async revokeMassSessions(sub: number, reason: string = 'Mass Revokation by internal service', execludeSessionID: string) {
		await this.sessionRepository.revokeMassForUser(
			sub,
			reason,
			execludeSessionID
		);
	}

	async getActiveSessions(sub: number, currentSessionID: string) {
		const sessions = await this.sessionRepository.findAllActive(sub);

		return sessions.map((session) => {
			logger.debug({ ip: session.ip_address, res: geoip.lookup(session.ip_address) });
			const sessionGeo = geoip.lookup(session.ip_address) || {};
			return {
				session_id: session.session_id,
				version: session.version,
				is_revoked: session.is_revoked,
				reason: session.reason,
				device: session.device,
				browser: session.browser,
				geo: {
					country: sessionGeo.country,
					region: sessionGeo.region,
					city: sessionGeo.city
				},
				created_at: session.created_at,
				expires_at: session.expires_at,
				updated_at: session.updated_at,
				user_id: session.user_id,
				is_current: session.session_id === currentSessionID,
			};
		});
	}

	// /**
	//  * Validates a session based on the provided refresh token and session fingerprint.
	//  * A valid session means that the refresh token is valid (signature) and not expired.
	//  * This function does not perform any actions; it only checks and throws errors if validation fails.
	//  * It is the caller's responsibility to take actions if errors are thrown.
	//  * @param refreshToken - The refresh token to validate.
	//  * @param newSessionFingerprint - The fingerprint of the current session (device, browser, IP).
	//  * @throws {TokenExpiredError} If the refresh token has expired.
	//  * @throws {TokenInvalidError} If the refresh token is invalid.
	//  * @throws {SessionNotFoundError} If the session is not found.
	//  * @throws {SessionRevokedError} If the session has been revoked or fails security checks.
	//  * @throws {SessionExpiredError} If the session has expired.
	//  * @returns The decoded payload of the refresh token if the session is valid.
	//  */
	// private async isValidSession(refreshToken: string, newSessionFingerprint: ISessionFingerprint) {
	// 	const refreshTokenPayload = await this.JWTUtils.verifyRefreshToken(refreshToken);

	// 	const { device, browser, ip_address }: ISessionFingerprint = newSessionFingerprint;
	// 	const { session_id, version, sub }: JWT_REFRESH_PAYLOAD = refreshTokenPayload;

	// 	const isFound = await this.sessionRepository.findOne(session_id, sub);

	// 	if (!isFound)
	// 		throw new SessionNotFoundError();

	// 	if (isFound.version !== version) 				// RE-USE
	// 		throw new SessionRevokedError('Session revoked for re-use');
	// 	if (isFound.is_revoked)							// EXPIRED
	// 		throw new SessionRevokedError('Session already revoked');
	// 	if (nowInSeconds() > isFound.expires_at)		// EXPIRED
	// 		throw new SessionExpiredError();

	// 	if (!this.authConfig.allowIpChange && isFound.ip_address !== ip_address)					// IP CHANGE
	// 		throw new SessionRevokedError('Session revoked for IP change');
	// 	if (!this.authConfig.allowDeviceChange && isFound.device !== device)						// DEVICE CHANGE
	// 		throw new SessionRevokedError('Session revoked for device change');
	// 	if (!this.authConfig.allowBrowserChange && isFound.browser !== browser)						// BROWSER CHANGE
	// 		throw new SessionRevokedError('Session revoked for browser change');

	// 	return this.JWTUtils.decodeJWT<JWT_REFRESH_PAYLOAD>(refreshToken);
	// }
}

export default SessionsService;
