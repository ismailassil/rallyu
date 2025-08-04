import { db } from "../database";
import { ISessionFingerprint } from "../types";
import { InternalServerError } from "../types/auth.types";

class SessionRepository {
	constructor() {

	}

	async findOne(session_id: string, user_id: number) {
		try {
			const getResult = await db.get(
				`SELECT * FROM refresh_tokens WHERE session_id = ? AND user_id = ?`,
				[session_id, user_id]
			);
			return getResult ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findAllActive(user_id: number) {
		try {
			const allResult = await db.all(
				`SELECT * FROM refresh_tokens WHERE is_revoked = false AND user_id = ?`,
				[user_id]
			);
			return allResult;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findAllRevoked(user_id: number) {
		try {
			const allResult = await db.all(
				`SELECT * FROM refresh_tokens WHERE is_revoked = true AND user_id = ?`,
				[user_id]
			);
			return allResult;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async create(
			session_id: string,
			device_name: string,
			browser_version: string,
			ip_address: string,
			created_at: number,
			expires_at: number,
			user_id: number
		) : Promise<number> {
		
		try {
			const runResult = await db.run(
				`INSERT INTO refresh_tokens (session_id, created_at, expires_at, device_name, browser_version, ip_address, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
				[session_id, created_at, expires_at, device_name, browser_version, ip_address, user_id]
			);
			return runResult.lastID;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async update(
		session_id: string,
		user_id: number,
		updates: Partial<{
			version: number,
			is_revoked: boolean,
			reason: string,
			device_name: string,
			browser_version: string,
			ip_address: string,
			created_at: number,
			expires_at: number,
		}>
		
	) : Promise<boolean> {
		const keys: string[] = [];
		const values: any[] = [];

		if (updates.version !== undefined) {
			keys.push(`version = ?`);
			values.push(updates.version);
		}
		if (updates.is_revoked !== undefined) {
			keys.push(`is_revoked = ?`);
			values.push(updates.is_revoked ? 1 : 0);
		}
		if (updates.reason !== undefined) {
			keys.push(`reason = ?`);
			values.push(updates.reason);
		}
		if (updates.device_name !== undefined) {
			keys.push(`device_name = ?`);
			values.push(updates.device_name);
		}
		if (updates.browser_version !== undefined) {
			keys.push(`browser_version = ?`);
			values.push(updates.browser_version);
		}
		if (updates.ip_address !== undefined) {
			keys.push(`ip_address = ?`);
			values.push(updates.ip_address);
		}
		if (updates.created_at !== undefined) {
			keys.push(`created_at = ?`);
			values.push(updates.created_at);
		}
		if (updates.expires_at !== undefined) {
			keys.push(`expires_at = ?`);
			values.push(updates.expires_at);
		}

		if (keys.length === 0) {
			return false;
		}

		keys.push(`updated_at = CURRENT_TIMESTAMP`);
		values.push(session_id);
		values.push(user_id);

		const runResult = await db.run(
			`UPDATE refresh_tokens SET ${keys.join(', ')} WHERE session_id = ? AND user_id = ?`,
			values
		);

		return runResult.changes > 0;
	}

	async updateAll(
		user_id: number,
		updates: Partial<{
			version: number,
			is_revoked: boolean,
			reason: string,
			device_name: string,
			browser_version: string,
			ip_address: string,
			created_at: number,
			expires_at: number,
		}>
		
	) : Promise<boolean> {
		const keys: string[] = [];
		const values: any[] = [];

		if (updates.version !== undefined) {
			keys.push(`version = ?`);
			values.push(updates.version);
		}
		if (updates.is_revoked !== undefined) {
			keys.push(`is_revoked = ?`);
			values.push(updates.is_revoked ? 1 : 0);
		}
		if (updates.reason !== undefined) {
			keys.push(`reason = ?`);
			values.push(updates.reason);
		}
		if (updates.device_name !== undefined) {
			keys.push(`device_name = ?`);
			values.push(updates.device_name);
		}
		if (updates.browser_version !== undefined) {
			keys.push(`browser_version = ?`);
			values.push(updates.browser_version);
		}
		if (updates.ip_address !== undefined) {
			keys.push(`ip_address = ?`);
			values.push(updates.ip_address);
		}
		if (updates.created_at !== undefined) {
			keys.push(`created_at = ?`);
			values.push(updates.created_at);
		}
		if (updates.expires_at !== undefined) {
			keys.push(`expires_at = ?`);
			values.push(updates.expires_at);
		}

		if (keys.length === 0) {
			return false;
		}

		keys.push(`updated_at = CURRENT_TIMESTAMP`);
		values.push(user_id);

		const runResult = await db.run(
			`UPDATE refresh_tokens SET ${keys.join(', ')} WHERE user_id = ?`,
			values
		);

		return runResult.changes > 0;
	}

	// async revokeSession(
	// 		session_id: string,
	// 		user_id: number,
	// 		reason: string
	// 	) : Promise<{ lastID: number, changes: number }> {
		
	// 	const runResult = await db.run(
	// 		`UPDATE refresh_tokens SET is_revoked = true, reason = ? WHERE session_id = ? AND user_id = ?`,
	// 		[reason, session_id, user_id]
	// 	);
		
	// 	return { lastID: runResult.lastID, changes: runResult.changes };
	// }

	// async revokeAllSessions(
	// 		user_id: number,
	// 		reason: string
	// 	) : Promise<{ lastID: number, changes: number }> {
		
	// 	const runResult = await db.run(
	// 		`UPDATE refresh_tokens SET is_revoked = true, reason = ? WHERE is_revoked = false AND user_id = ?`,
	// 		[reason, user_id]
	// 	);
		
	// 	return { lastID: runResult.lastID, changes: runResult.changes };
	// }
}

export default SessionRepository;