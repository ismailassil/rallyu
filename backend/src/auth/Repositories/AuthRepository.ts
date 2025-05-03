import { app as fastify } from '../../app.js';
import { signUpType, TokenType } from './types.js';

class AuthRepository {
	async getPasswordByUsername(
		username: string,
	): Promise<{ id: number; password: string; role: string } | undefined> {
		const user = await fastify.database.get(
			'SELECT id, password FROM users WHERE username = ?',
			username,
		);
		if (!user) return undefined;

		return { id: user.id, password: user.password, role: user.role };
	}

	async getUserByUsername(username: string): Promise<string> {
		const user = await fastify.database.get(
			'SELECT * FROM users WHERE username = ?',
			username,
		);

		return user?.username;
	}

	async getUserById(id: number): Promise<string> {
		const user = await fastify.database.get(
			'SELECT * FROM users WHERE id = ?',
			id,
		);

		return user?.password;
	}

	async insertNewUser(
		userInfo: signUpType,
		hashedPassword: string,
	): Promise<number | undefined> {
		const { firstName, lastName, username, email } = userInfo;

		const user = await fastify.database.run(
			'INSERT INTO users (firstName, lastName, username, email, password) VALUES (?, ?, ?, ?, ?)',
			firstName,
			lastName,
			username,
			email,
			hashedPassword,
		);

		return user?.lastID;
	}

	async insertToken(
		hashedToken: string,
		id: number,
		device_info: string | undefined,
	): Promise<number | undefined> {
		const token = await fastify.database.run(
			'INSERT INTO refresh_tokens (user_id, token, device_info) VALUES (?, ?, ?)',
			id,
			hashedToken,
			device_info,
		);

		return token?.lastID;
	}

	async getToken(id: number): Promise<TokenType> {
		const token = await fastify.database.get(
			'SELECT * FROM refresh_tokens WHERE user_id = ?',
			id,
		);

		return token;
	}
}

export default AuthRepository;
