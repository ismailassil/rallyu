import ARepository from "./ARepository";
import { db } from "../database";

interface IResetPassword {
	id: number;
	code: string;
	expires_at: number;
	user_id: number;
}

class ResetPasswordRepository extends ARepository {

	/**
	 * Find a reset password entry by user ID.
	 * @param id - row ID
	 * @return The reset password entry if found, otherwise null.
	 */
	async findOne(id: number) {
		try {
			const getResult = await db.get(
				`SELECT * FROM reset_password WHERE id = ?`,
				[id]
			);
			return getResult ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding reset password by ID');
		}
		return null;
	}

	/**
	 * Find a reset password entry by user ID.
	 * @param userID - user ID
	 * @return The reset password entry if found, otherwise null.
	 */
	async findByUserID(userID: number) : Promise<IResetPassword | null> {
		try {
			const getResult = await db.get(
				`SELECT * FROM reset_password WHERE user_id = ?`,
				[userID]
			);
			return getResult ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding reset password by user ID');
		}
		return null;
	}

	/**
	 * Create a new reset password entry.
	 * @param userID - user ID
	 * @param code - reset code
	 * @param expiresAt - expiration timestamp
	 * @return The ID of the newly created reset password entry.
	 */
	async create(userID: number, code: string, expiresAt: number) : Promise<number | null> {
		try {
			const runResult = await db.run(
				`INSERT INTO reset_password (user_id, code, expires_at) VALUES (?, ?, ?)`,
				[userID, code, expiresAt]
			);
			return runResult.lastID;
		} catch (err: any) {
			this.handleDatabaseError(err, 'creating reset password entry');
		}
		return null;
	}

	/**
	 * Delete all reset password entries for a given user ID.
	 * @param userID - user ID
	 * @return True if any entries were deleted, otherwise false.
	 */
	async deleteAllByUserID(userID: number) : Promise<boolean> {
		try {
			const runResult = await db.run(
				`DELETE FROM reset_password WHERE user_id = ?`,
				[userID]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting reset password entries by user ID');
		}
		return false;
	}
}

export default ResetPasswordRepository;