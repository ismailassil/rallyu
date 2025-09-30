import { db } from "../../database";
import ARepository from "./ARepository";

interface EnabledTwoFactorMethod {
	id: number;
	method: string;
	totp_secret: string;
	user_id: number;
}

interface PendingTwoFactorMethod {
	id: number;
	method: string;
	temp_value: string;
	expires_at: number;
	user_id: number;
}

interface PendingTwoFactorLoginSession {
	id: number;
	method: string;
	code: string;
	remaining_attempts: number;
	remaining_resends: number;
	expires_at: number;
	user_id: number;
}

class TwoFactorRepository extends ARepository {

	/**
	 * Find enabled 2FA method by its ID.
	 * @param id - ID of the enabled 2FA method.
	 * @returns The enabled 2FA method object if found, otherwise null.
	 */
	async findEnabledMethodByID(id: number): Promise<EnabledTwoFactorMethod | null> {
		try {
			const enabledMethod = await db.get(
				`SELECT * FROM _2fa_methods WHERE id = ?`,
				[id]
			);
			return enabledMethod ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding enabled 2FA method by ID');
		}
		return null;
	}

	/**
	 * Find enabled 2FA method by its type for a user.
	 * @param userID - ID of the user.
	 * @param method - Type of the 2FA method ('EMAIL', 'TOTP', 'SMS').
	 * @returns The enabled 2FA method object if found, otherwise null.
	 */
	async findEnabledMethodByType(userID: number, method: string): Promise<EnabledTwoFactorMethod | null> {
		try {
			const enabledMethod = await db.get(
				`SELECT * FROM _2fa_methods WHERE user_id = ? AND method = ?`,
				[userID, method]
			);
			return enabledMethod ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding enabled 2FA method by type');
		}
		return null;
	}

	/**
	 * Find enabled 2FA methods for a user.
	 * @param userID - ID of the user.
	 * @returns Array of enabled 2FA methods.
	 */
	async findEnabledMethodsByUserID(userID: number): Promise<EnabledTwoFactorMethod[]> {
		try {
			const allEnabled = await db.all(
				`SELECT * FROM _2fa_methods WHERE user_id = ?`,
				[userID]
			);

			return allEnabled as EnabledTwoFactorMethod[];
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding enabled 2FA methods by user ID');
		}
		return [];
	}

	/**
	 * Find pending 2FA method by its ID.
	 * @param id - ID of the pending 2FA method.
	 * @returns The pending 2FA method object if found, otherwise null.
	 */
	async findPendingMethodByID(id: number): Promise<PendingTwoFactorMethod | null> {
		try {
			const pendingMethod = await db.get(
				`SELECT * FROM pending_2fa WHERE id = ?`,
				[id]
			);
			return pendingMethod ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding pending 2FA method by ID');
		}
		return null;
	}

	/**
	 * Find pending 2FA method by its type for a user.
	 * @param userID - ID of the user.
	 * @param method - Type of the 2FA method ('EMAIL', 'TOTP', 'SMS').
	 * @returns The pending 2FA method object if found, otherwise null.
	 */
	async findPendingMethodByType(userID: number, method: string): Promise<PendingTwoFactorMethod | null> {
		try {
			const pendingMethod = await db.get(
				`SELECT * FROM pending_2fa WHERE user_id = ? AND method = ?`,
				[userID, method]
			);
			return pendingMethod ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding pending 2FA method by type');
		}
		return null;
	}

	/**
	 * Find pending 2FA methods for a user.
	 * @param userID - ID of the user.
	 * @returns Array of pending 2FA methods.
	 */
	async findPendingMethodsByUserID(userID: number): Promise<PendingTwoFactorMethod[]> {
		try {
			const allPending2FAMethods = await db.all(
				`SELECT * FROM pending_2fa WHERE user_id = ?`,
				[userID]
			);

			return allPending2FAMethods as PendingTwoFactorMethod[];
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding pending 2FA methods by user ID');
		}
		return [];
	}

	/**
	 * Find pending 2FA login session by its ID.
	 * @param id - ID of the pending 2FA login session.
	 * @returns The pending 2FA login session object if found, otherwise null.
	 */
	async findPendingLoginSessionByID(id: number): Promise<PendingTwoFactorLoginSession | null> {
		try {
			const pendingLoginSession = await db.get(
				`SELECT * FROM pending_2fa_login WHERE id = ?`,
				[id]
			);
			return pendingLoginSession ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding pending 2FA login session by ID');
		}
		return null;
	}

	/**
	 * Create a new enabled 2FA method.
	 * @param method - Type of the 2FA method ('EMAIL', 'TOTP', 'SMS').
	 * @param totpSecret - TOTP Base32 Secret (for TOTP method else null).
	 * @param userID - ID of the user.
	 * @returns The ID of the newly created enabled 2FA method.
	 */
	async createEnabledMethod(method: string, totpSecret: string | null, userID: number): Promise<number> {
		try {
			const runResult = await db.run(
				`INSERT INTO _2fa_methods (method, totp_secret, user_id) VALUES (?, ?, ?)`,
				[method, totpSecret, userID]
			);
			return runResult.lastID;
		} catch (err: any) {
			this.handleDatabaseError(err, 'creating enabled 2FA method');
		}
		return -1;
	}

	/**
	 * Create a new pending 2FA method.
	 * @param method - Type of the 2FA method ('EMAIL', 'TOTP', 'SMS').
	 * @param tempValue - Temporary secret value (OTP Code, TOTP Base32 Secret).
	 * @param expiresAt - Expiration timestamp.
	 * @param userID - ID of the user.
	 * @returns The ID of the newly created pending 2FA method.
	 */
	async createPendingMethod(method: string, tempValue: string, expiresAt: number, userID: number): Promise<number> {
		try {
			const runResult = await db.run(
				`INSERT INTO pending_2fa (method, temp_value, expires_at, user_id) VALUES (?, ?, ?, ?)`,
				[method, tempValue, expiresAt, userID]
			);
			return runResult.lastID;
		} catch (err: any) {
			this.handleDatabaseError(err, 'creating pending 2FA method');
		}
		return -1;
	}

	/**
	 * Create a new pending 2FA login session.
	 * @param method - Type of the 2FA method ('EMAIL', 'TOTP', 'SMS' OR null when first created).
	 * @param code - OTP Code sent to user (null when first created).
	 * @param maxAttempts - Maximum number of code verification attempts.
	 * @param maxResends - Maximum number of code resends.
	 * @param expiresAt - Expiration timestamp.
	 * @param userID - ID of the user.
	 * @returns The ID of the newly created pending 2FA login session.
	 */
	async createPendingLoginSession(method: string | null, code: string | null, maxAttempts: number, maxResends: number, expiresAt: number, userID: number): Promise<number> {
		try {
			const runResult = await db.run(
				`INSERT INTO pending_2fa_login (method, code, remaining_attempts, remaining_resends, expires_at, user_id) VALUES (?, ?, ?, ?, ?, ?)`,
				[method, code, maxAttempts, maxResends, expiresAt, userID]
			);
			return runResult.lastID;
		} catch (err: any) {
			this.handleDatabaseError(err, 'creating pending 2FA login session');
		}
		return -1;
	}

	/**
	 * Delete an enabled 2FA method by its ID.
	 * @param id - ID of the enabled 2FA method to delete.
	 * @returns True if the deletion was successful, otherwise false.
	 */
	async deleteEnabledMethodByID(id: number): Promise<boolean> {
		try {
			const runResult = await db.run(
				`DELETE FROM _2fa_methods WHERE id = ?`,
				[id]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting enabled 2FA method by ID');
		}
		return false;
	}

	/**
	 * Delete a pending 2FA method by its ID.
	 * @param id - ID of the pending 2FA method to delete.
	 * @returns True if the deletion was successful, otherwise false.
	 */
	async deletePendingMethodByID(id: number): Promise<boolean> {
		try {
			const runResult = await db.run(
				`DELETE FROM pending_2fa WHERE id = ?`,
				[id]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting pending 2FA method by ID');
		}
		return false;
	}

	/**
	 * Delete a pending 2FA login session by its ID.
	 * @param id - ID of the pending 2FA login session to delete.
	 * @returns True if the deletion was successful, otherwise false.
	 */
	async deletePendingLoginSessionByID(id: number): Promise<boolean> {
		try {
			const runResult = await db.run(
				`DELETE FROM pending_2fa_login WHERE id = ?`,
				[id]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting pending 2FA login session by ID');
		}
		return false;
	}

	/**
	 * Update a pending 2FA method.
	 * @param id - ID of the pending 2FA method to update.
	 * @param updates - Object containing fields to update.
	 * @return True if the update was successful, otherwise false.
	 */
	async updatePendingMethod(id: number, updates: Partial<PendingTwoFactorMethod>): Promise<boolean> {
		try {
			const fields = Object.keys(updates);
			if (fields.length === 0) return false;

			const setClause = fields.map(field => `${field} = ?`).join(', ');
			const values = fields.map(field => (updates as any)[field]);
			values.push(id);

			const runResult = await db.run(
				`UPDATE pending_2fa SET ${setClause} WHERE id = ?`,
				values
			);

			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'updating pending 2FA method');
		}
		return false;
	}

	/**
	 * Update a pending 2FA login session.
	 * @param id - ID of the pending 2FA login session to update.
	 * @param updates - Object containing fields to update.
	 * @return True if the update was successful, otherwise false.
	 */
	async updatePendingLoginSession(id: number, updates: Partial<PendingTwoFactorLoginSession>): Promise<boolean> {
		try {
			const fields = Object.keys(updates);
			if (fields.length === 0) return false;

			const setClause = fields.map(field => `${field} = ?`).join(', ');
			const values = fields.map(field => (updates as any)[field]);
			values.push(id);

			const runResult = await db.run(
				`UPDATE pending_2fa_login SET ${setClause} WHERE id = ?`,
				values
			);

			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'updating pending 2FA login session');
		}
		return false;
	}

	/**
	 * Delete all enabled 2FA methods for a user.
	 * @param userID - ID of the user.
	 * @return The number of rows affected.
	 */
	async deleteAllEnabledMethodsByUserID(userID: number): Promise<number> {
		try {
			const runResult = await db.run(
				`DELETE FROM _2fa_methods WHERE user_id = ?`,
				[userID]
			);
			return runResult.changes;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting all enabled 2FA methods by user ID');
		}
		return 0;
	}

	/**
	 * Delete all pending 2FA methods for a user.
	 * @param userID - ID of the user.
	 * @return The number of rows affected.
	 */
	async deleteAllPendingMethodsByUserID(userID: number): Promise<number> {
		try {
			const runResult = await db.run(
				`DELETE FROM pending_2fa WHERE user_id = ?`,
				[userID]
			);
			return runResult.changes;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting all pending 2FA methods by user ID');
		}
		return 0;
	}

	/**
	 * Delete all pending 2FA login sessions for a user.
	 * @param userID - ID of the user.
	 * @return The number of rows affected.
	 */
	async deleteAllPendingLoginSessionsByUserID(userID: number): Promise<number> {
		try {
			const runResult = await db.run(
				`DELETE FROM pending_2fa_login WHERE user_id = ?`,
				[userID]
			);
			return runResult.changes;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting all pending 2FA login sessions by user ID');
		}
		return 0;
	}
}

export default TwoFactorRepository;