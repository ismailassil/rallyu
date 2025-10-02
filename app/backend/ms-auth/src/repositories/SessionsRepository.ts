import { db } from "../database";
import ARepository from "./ARepository";

interface Session {
	session_id: number;
	version: number;
	is_revoked: boolean;
	reason: string | null;
	device_name: string;
	browser_version: string;
	ip_address: string;
	created_at: number;
	expires_at: number;
	updated_at: number;
	user_id: number;
}

class SessionsRepository extends ARepository {

	/**
	 * Find a session by its ID and user ID.
	 * @param sessionID - ID of the session.
	 * @param userID - ID of the user.
	 * @returns The session object if found, otherwise null.
	 */
	async findOne(sessionID: string, userID: number) : Promise<Session | null> {
		try {
			const getResult = await db.get(
				`SELECT * FROM refresh_tokens WHERE session_id = ? AND user_id = ?`,
				[sessionID, userID]
			);
			return getResult ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding session by ID and user ID');
		}
		return null;
	}

	/**
	 * Find all active sessions for a user.
	 * @param userID - ID of the user.
	 * @returns An array of active sessions.
	 */
	async findAllActive(userID: number) {
		try {
			const allResult = await db.all(
				`SELECT * FROM refresh_tokens WHERE is_revoked = false AND user_id = ?`,
				[userID]
			);
			return allResult;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding all active sessions for user');
		}
		return [];
	}

	/**
	 * Find all revoked sessions for a user.
	 * @param userID - ID of the user.
	 * @returns An array of revoked sessions.
	 */
	async findAllRevoked(userID: number) {
		try {
			const allResult = await db.all(
				`SELECT * FROM refresh_tokens WHERE is_revoked = true AND user_id = ?`,
				[userID]
			);
			return allResult;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding all revoked sessions for user');
		}
		return [];
	}

	/**
	 * Create a new session.
	 * @param sessionID - ID of the session.
	 * @param deviceName - Name of the device.
	 * @param browserVersion - Version of the browser.
	 * @param ipAddress - IP address of the user.
	 * @param createdAt - Timestamp when the session was created.
	 * @param expiresAt - Timestamp when the session expires.
	 * @param userID - ID of the user.
	 * @returns The ID of the newly created session.
	 */
	async create(
		sessionID: string,
		deviceName: string,
		browserVersion: string,
		ipAddress: string,
		createdAt: number,
		expiresAt: number,
		userID: number
	) : Promise<number | null> {
		try {
			const runResult = await db.run(
				`INSERT INTO refresh_tokens (session_id, created_at, expires_at, device_name, browser_version, ip_address, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
				[sessionID, createdAt, expiresAt, deviceName, browserVersion, ipAddress, userID]
			);
			return runResult.lastID;
		} catch (err: any) {
			this.handleDatabaseError(err, 'creating new session');
		}
		return null;
	}

	/**
	 * Update a session.
	 * @param sessionID - ID of the session.
	 * @param updates - An object containing the fields to update.
	 * @returns True if the update was successful, otherwise false.
	 */
	async update(sessionID: string, updates: Partial<Session>) : Promise<boolean> {
		try {
			const fields = Object.keys(updates);
			if (fields.length === 0) return false;

			const setClause = fields.map(field => `${field} = ?`).join(', ');
			const values = fields.map(field => (updates as any)[field]);
			values.push(sessionID);

			const runResult = await db.run(
				`UPDATE refresh_tokens SET ${setClause}, updated_at = (strftime('%s','now')) WHERE session_id = ?`,
				values
			);
			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'updating session');
		}
		return false;
	}

	/**
	 * Delete a session by its ID.
	 * @param sessionID - ID of the session.
	 * @returns True if the session was deleted, otherwise false.
	 */
	async delete(sessionID: string) : Promise<boolean> {
		try {
			const runResult = await db.run(
				`DELETE FROM refresh_tokens WHERE session_id = ?`,
				[sessionID]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting session');
		}
		return false;
	}

	/**
	 * Delete all sessions for a user.
	 * @param userID - ID of the user.
	 * @returns The number of sessions deleted.
	 */
	async deleteAllForUser(userID: number) : Promise<number> {
		try {
			const runResult = await db.run(
				`DELETE FROM refresh_tokens WHERE user_id = ?`,
				[userID]
			);
			return runResult.changes;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting all sessions for user');
		}
		return 0;
	}

	/**
	 * Revoke a session by its ID.
	 * @param sessionID - ID of the session.
	 * @param reason - Reason for revocation.
	 * @returns True if the session was revoked, otherwise false.
	 */
	async revoke(sessionID: string, reason: string) : Promise<boolean> {
		try {
			const runResult = await db.run(
				`UPDATE refresh_tokens SET is_revoked = true, reason = ?, updated_at = (strftime('%s','now')) WHERE session_id = ?`,
				[reason, sessionID]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'revoking session');
		}
		return false;
	}

	/**
	 * Revoke all sessions for a user.
	 * @param userID - ID of the user.
	 * @param reason - Reason for revocation.
	 * @returns The number of sessions revoked.
	 */
	async revokeAllForUser(userID: number, reason: string) : Promise<number> {
		try {
			const runResult = await db.run(
				`UPDATE refresh_tokens SET is_revoked = true, reason = ?, updated_at = (strftime('%s','now')) WHERE user_id = ? AND is_revoked = false`,
				[reason, userID]
			);
			return runResult.changes;
		} catch (err: any) {
			this.handleDatabaseError(err, 'revoking all sessions for user');
		}
		return 0;
	}
}

export default SessionsRepository;