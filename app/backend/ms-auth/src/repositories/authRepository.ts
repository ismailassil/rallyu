// import { db } from "../database";
// import { JWT_REFRESH_PAYLOAD } from "../utils/auth/Auth";
// import { ISessionFingerprint } from "../types";
 
// class AuthRepository {
// 	constructor() {

// 	}

// 	async findRefreshToken(jti: string, user_id: number) {

// 		const getResult = await db.get(
// 			`SELECT * FROM refresh_tokens WHERE jti = ? AND user_id = ?`,
// 			[jti, user_id]
// 		);

// 		return getResult;
// 	}

// 	async createRefreshToken(payload: JWT_REFRESH_PAYLOAD, fingerprint: ISessionFingerprint) : Promise<{ lastID: number, changes: number }> {
// 		const max_age = Math.floor(Date.now() / 1000 + (60 * 60 * 24 * 30)); // 30d

// 		const runResult = await db.run(
// 			`INSERT INTO refresh_tokens (jti, created_at, expires_at, max_age, user_id, device_name, browser_version, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
// 			[payload.jti, payload.iat, payload.exp, max_age, payload.sub, fingerprint.device_name, fingerprint.browser_version, fingerprint.ip_address]
// 		);

// 		return { lastID: runResult.lastID, changes: runResult.changes };
// 	}
	
// 	async revokeRefreshToken(jti: string) {
// 		const runResult = await db.run(
// 			`UPDATE refresh_tokens SET is_revoked = true WHERE jti = ?`,
// 			[jti]
// 		);
		
// 		return { lastID: runResult.lastID, changes: runResult.changes };
// 	}

// 	async revokeAllRefreshTokens(user_id: number) {
// 		const runResult = await db.run(
// 			`UPDATE refresh_tokens SET is_revoked = true WHERE user_id = ? AND is_revoked = false`,
// 			[user_id]
// 		);
		
// 		return { lastID: runResult.lastID, changes: runResult.changes };
// 	}
// }

// export default AuthRepository;