import { UUID } from "crypto";
import { db } from "../database";
import ARepository from "./ARepository";

export interface AuthChallenge {
	id: number;
	challenge_type: AuthChallengeType;
	method: AuthChallengeMethod | null;
	status: AuthChallengeStatus;
	token: UUID;
	target: string | null;
	secret: string | null;
	verify_attempts: number;
	resend_attempts: number;
	expires_at: number;
	created_at: number;
	user_id: number;
}

export type AuthChallengeType = '2fa_setup' | '2fa_login' | 'password_reset' | 'email_verification' | 'phone_verification';
export type AuthChallengeMethod = 'SMS' | 'EMAIL' | 'TOTP';
export type AuthChallengeStatus = 'PENDING' | 'VERIFIED' | 'COMPLETED' | 'EXPIRED' | 'FAILED';

/**
 * Repository for auth_challenges table database operations.
 * @extends ARepository
 */

class AuthChallengesRepository extends ARepository {

	/**
	 * Find a challenge by ID.
	 * @param id - challenge ID
	 * @returns The challenge object if found, otherwise null.
	 */
	async findOne(id: number) : Promise<AuthChallenge | null> {
		try {
			const getResult = await db.get(
				`SELECT * FROM auth_challenges WHERE id = ?`,
				[id]
			);

			return getResult ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding auth challenge by ID');
		}
		return null;
	}

	/**
	 * Find a challenge by its token.
	 * @param token - challenge's token
	 * @returns The challenge object if found, otherwise null.
	 */
	async findByToken(token: UUID) : Promise<AuthChallenge | null> {
		try {
			const getResult = await db.get(
				`SELECT * FROM auth_challenges WHERE token = ?`,
				[token]
			);

			return getResult ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding auth challenge by token');
		}
		return null;
	}

	/**
	 * Find a challenge by its token and type.
	 * @param token - challenge's token
	 * @param type - challenge's type
	 * @param method - challenge's method
	 * @returns The challenge object if found, otherwise null.
	 */
	async findByQuery(token: UUID, status: AuthChallengeStatus, challenge_type?: AuthChallengeType, method?: AuthChallengeMethod) : Promise<AuthChallenge | null> {
		try {
			let SQLQuery = 'token = ?';
			let params: Array<any> = [token];
			if (challenge_type) {
				SQLQuery += ' AND challenge_type = ?';
				params.push(challenge_type);
			}
			if (method) {
				SQLQuery += ' AND method = ?';
				params.push(method);
			}
			SQLQuery += ' AND status = ?';
			params.push(status);

			const getResult = await db.get(
				`SELECT * FROM auth_challenges WHERE ${SQLQuery}`,
				params
			);

			return getResult ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding auth challenge by query');
		}
		return null;
	}

	/**
	 * Create a new challenge.
	 * @param challenge_type - challenge's type
	 * @param method - challenge's method
	 * @param token - challenge's token
	 * @param target - challenge's target (phone number, email)
	 * @param secret - otp/totp_base32_secret
	 * @param expires_at - challenge's expiry in seconds
	 * @param user_id - challenge's owner
	 * @returns The ID of the newly created challenge.
	 */
	async create(
		challenge_type: AuthChallengeType,
		method: AuthChallengeMethod | null,
		token: UUID,
		target: string | null,
		secret: string | null,
		expires_at: number,
		user_id: number
	) : Promise<number> {

		try {
			const runResult = await db.run(
				`INSERT INTO auth_challenges (challenge_type, method, token, target, secret, expires_at, user_id)
					VALUES (?, ?, ?, ?, ?, ?, ?)`,
				[challenge_type, method, token, target, secret, expires_at, user_id]
			);

			return runResult.lastID;
		} catch (err: any) {
			this.handleDatabaseError(err, 'creating new auth challenge');
		}
		return -1;
	}

	/**
	 * Update a challenge.
	 * @param id - challenge ID
	 * @param updates - Object containing fields to update.
	 * @returns True if the update was successful, otherwise false.
	 */
	async update(id: number, updates: Partial<AuthChallenge>) : Promise<boolean> {
		try {
			const fields = Object.keys(updates);
			if (fields.length === 0) return false;

			const setClause = fields.map(field => `${field} = ?`).join(', ');
			const values = fields.map(field => (updates as any)[field]);
			values.push(id);

			const runResult = await db.run(
				`UPDATE auth_challenges SET ${setClause} WHERE id = ?`,
				values
			);

			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'updating auth challenge');
		}
		return false;
	}

	/**
	 * Delete a challenge by ID.
	 * @param id - challenge ID
	 * @returns The number of rows affected.
	 */
	async delete(id: number) : Promise<number> {
		try {
			const runResult = await db.run(
				`DELETE FROM auth_challenges WHERE id = ?`,
				[id]
			);

			return runResult.changes;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting auth challenge');
		}
		return 0;
	}

	async cleanupPendingByUserID(userID: number, challenge_type: AuthChallengeType) {
		try {
			const runResult = await db.run(
				`DELETE FROM auth_challenges WHERE user_id = ? AND challenge_type = ? AND status = 'PENDING'`,
				[userID, challenge_type]
			);

			return runResult.changes;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting all auth challenge for a user');
		}
		return 0;
	}
}

export default AuthChallengesRepository;
