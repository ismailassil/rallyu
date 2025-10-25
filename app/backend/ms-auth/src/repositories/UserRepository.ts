import { db } from "../database";
import ARepository from "./ARepository";

interface User {
	id: number;
	username: string;
	password: string | null;
	email: string;
	first_name: string;
	last_name: string;
	avatar_url: string;
	auth_provider: string;
	auth_provider_id: string | null;
	role: string;
	bio: string;
	phone: string;
	email_verified: number;
	phone_verified: number;
	created_at: string;
	updated_at: string;
}

/**
 * Repository for users table database operations.
 * @extends ARepository
 */

class UserRepository extends ARepository {

	/**
	 * Find a user by ID.
	 * @param id - user ID
	 * @returns The user object if found, otherwise null.
	 */
	async findOne(id: number) : Promise<User | null> {
		try {
			const getResult = await db.get(
				`SELECT * FROM users WHERE id = ?`,
				[id]
			);
			return getResult ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding user by ID');
		}
		return null;
	}

	/**
	 * Find a user by username.
	 * @param username - user's username
	 * @returns The user object if found, otherwise null.
	 */
	async findByUsername(username: string) : Promise<User | null> {
		try {
			const getResult = await db.get(
				`SELECT * FROM users WHERE username = ?`,
				[username]
			);
			return getResult ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding user by username');
		}
		return null;
	}

	/**
	 * Find a user by email.
	 * @param email - user's email
	 * @returns The user object if found, otherwise null.
	 */
	async findByEmail(email: string) : Promise<User | null> {
		try {
			const getResult = await db.get(
				`SELECT * FROM users WHERE email = ?`,
				[email]
			);
			return getResult ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding user by email');
		}
		return null;
	}

	async findByAuthProvider(authProvider: string, authProviderID: string) {
		try {
			const getResult = await db.get(
				`SELECT * FROM users WHERE auth_provider = ? AND auth_provider_id = ?`,
				[authProvider, authProviderID]
			);
			return getResult ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding user by auth provider');
		}
		return null;
	}

	/**
	 * Create a new user.
	 * @param username - user's username
	 * @param password - user's hashed password
	 * @param email - user's email
	 * @param first_name - user's first name
	 * @param last_name - user's last name
	 * @param avatar_url - URL to user's avatar (HTTP link / Path to it on server)
	 * @param auth_provider - authentication provider (default: 'local')
	 * @param role - user's role (default: 'user')
	 * @param bio - user's bio (default: 'DFK')
	 * @returns The ID of the newly created user.
	 */
	async create(
		username: string,
		password: string | null = null,
		email: string,
		first_name: string,
		last_name: string,
		avatar_url: string = '/users/avatars/default.png',
		auth_provider: string = 'Local',
		auth_provider_id: string | null = null,
		role: string = 'user',
		bio: string = 'DFK',
	) : Promise<number> {

		try {
			const runResult = await db.run(
				`INSERT INTO users (username, password, email, first_name, last_name, avatar_url, auth_provider, auth_provider_id, role, bio)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[username, password, email, first_name, last_name, avatar_url, auth_provider, auth_provider_id, role, bio]
			);

			return runResult.lastID;
		} catch (err: any) {
			this.handleDatabaseError(err, 'creating new user');
		}
		return -1;
	}

	/**
	 * Update a user.
	 * @param id - user ID
	 * @param updates - Object containing fields to update.
	 * @returns True if the update was successful, otherwise false.
	 */
	async update(id: number, updates: Partial<User>) : Promise<boolean> {
		try {
			const fields = Object.keys(updates);
			if (fields.length === 0) return false;

			const setClause = fields.map(field => `${field} = ?`).join(', ');
			const values = fields.map(field => (updates as any)[field]);
			values.push(id);

			const runResult = await db.run(
				`UPDATE users SET ${setClause} WHERE id = ?`,
				values
			);
			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'updating user');
		}
		return false;
	}

	/**
	 * Delete a user by ID.
	 * @param id - user ID
	 * @returns The number of rows affected.
	 */
	async delete(id: number) : Promise<number> {
		try {
			const runResult = await db.run(
				`DELETE FROM users WHERE id = ?`,
				[id]
			);
			return runResult.changes;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting user');
		}
		return 0;
	}

	/**
	 * Search users by username or email or full name.
	 * @param query - search query
	 * @return An array of users matching the search criteria.
	 */
	async search(userID: number, query: string) : Promise<User[]> {
		try {
			const likeQuery = `%${query}%`;
			const allResults = await db.all(
				`SELECT u.id, u.username, u.avatar_url
						FROM users u
					LEFT JOIN relations r
						ON ((r.requester_user_id = u.id AND r.receiver_user_id = ?)
							OR (r.requester_user_id = ? AND r.receiver_user_id = u.id))
					WHERE (u.username LIKE ? OR u.email LIKE ? OR (u.first_name || ' ' || u.last_name) LIKE ?)
						AND (r.relation_status != 'BLOCKED' OR r.relation_status IS NULL)`,
				[userID, userID, likeQuery, likeQuery, likeQuery]
			);

			console.log('SEARCH RESULTS: ', allResults);

			return allResults as User[];
		} catch (err: any) {
			this.handleDatabaseError(err, 'searching users');
		}
		return [];
	}
}

export default UserRepository;
