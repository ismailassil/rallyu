import { db } from '../database';
import { InternalServerError } from '../types/auth.types';

class UserStatsRepository {
	async createForUser(userID: number) {
		try {
			const runResult = await db.run(
				`INSERT INTO users_stats (user_id)
					VALUES (?)`,
				[userID]
			);
			return runResult.lastID;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}
}

export default UserStatsRepository;