import { db } from "../database";
import { InternalServerError } from "../types/auth.types";

class ResetPasswordRepository {

	async create(user_id: number, code: string, expires_at: number) {
		try {
			const runResult = await db.run(
				`INSERT INTO reset_password (user_id, code, expires_at) VALUES (?, ?, ?)`,
				[user_id, code, expires_at]
			);
			return runResult.lastID;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findByUserID(user_id: number) {
		try {
			const getResult = await db.get(
				`SELECT user_id, code, expires_at FROM reset_password WHERE user_id = ?`,
				[user_id]
			);
			return getResult ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async deleteAll(user_id: number) {
		try {
			const runResult = await db.run(
				`DELETE FROM reset_password WHERE user_id = ?`,
				[user_id]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}
}

export default ResetPasswordRepository;