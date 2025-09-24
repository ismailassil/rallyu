import { db } from "../database";
import { CreateUserRequest, ISQLCreateUser, User } from "../types";
import { InternalServerError } from "../types/auth.types";

// avatar_url => avatar_url
class UserRepository {

	async create(
		first_name: string,
		last_name: string,
		email: string,
		username: string,
		password?: string,
		avatar_url: string = '/avatars/default.png',
		auth_provider: string = 'local',
		role: string = 'user',
		bio: string = 'DFK',
	) : Promise<number> {
		
		try {
			const runResult = await db.run(
				`INSERT INTO users (username, password, email, first_name, last_name, avatar_url, auth_provider, role, bio) 
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[username, password, email, first_name, last_name, avatar_url, auth_provider, role, bio]
			);

			return runResult.lastID;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findById(id: number) : Promise<User | null> {
		try {
			const getResult = await db.get<User>(
				`SELECT * FROM users WHERE id = ?`,
				[id]
			);
			return getResult ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findByUsername(username: string) : Promise<User | null> {
		try {
			const getResult = await db.get<User>(
				`SELECT * FROM users WHERE username = ?`,
				[username]
			);
			return getResult ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findByEmail(email: string) : Promise<User | null> {
		try {
			const getResult = await db.get<User>(
				`SELECT * FROM users WHERE email = ?`,
				[email]
			);
			return getResult ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async searchByUsername(user_id: number, username: string) {
		try {
			const allResult = await db.all(
				`SELECT u.id, u.username, u.avatar_url
					FROM users u 
				LEFT JOIN relations r 
					ON ((r.requester_user_id = u.id AND r.receiver_user_id = ?)
						OR (r.requester_user_id = ? AND r.receiver_user_id = u.id))
				WHERE (u.username LIKE '%' || ? || '%')
					AND (r.relation_status != 'BLOCKED' OR r.relation_status IS NULL)`,
				[user_id, user_id, username]
			);
			return allResult;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async update(id: number, updates: Partial<Pick<User, 'username' | 'password' | 'first_name' | 'last_name'>>) : Promise<boolean> {
		const keys = [];
		const values = [];

		if (updates.username) {
			keys.push(`username = ?`);
			values.push(updates.username);
		}
		if (updates.password) {
			keys.push(`password = ?`);
			values.push(updates.password);
		}
		if (updates.first_name) {
			keys.push(`first_name = ?`);
			values.push(updates.first_name);
		}
		if (updates.last_name) {
			keys.push(`last_name = ?`);
			values.push(updates.last_name);
		}

		if (keys.length === 0)
			return false;

		keys.push(`updated_at = CURRENT_TIMESTAMP`);
		values.push(id);

		try {
			const runResult = await db.run(
				`UPDATE users SET ${keys.join(', ')} WHERE id = ?`,
				values
			);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async delete(id: number) : Promise<boolean> {
		try {
			const runResult = await db.run(
				`DELETE FROM users WHERE id = ?`,
				[id]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	// TODO: REMOVE THIS
	async updateAvatar(id: number, avatar_url: string) {
		try {
			const runResult = await db.run(
				`UPDATE users SET avatar_url = ? WHERE id = ?`
			, [avatar_url, id]);

			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}
}

export default UserRepository;