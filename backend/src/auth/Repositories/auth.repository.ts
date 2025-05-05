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
		session_id: string,
		device_info: string | undefined,
	): Promise<number | undefined> {
		const token = await fastify.database.run(
			'INSERT INTO refresh_tokens (session_id, user_id, token, device_info) VALUES (?, ?, ?, ?)',
			session_id,
			id,
			hashedToken,
			device_info,
		);

		return token?.lastID;
	}

	async getToken(id: number, sessionId: string): Promise<TokenType> {
		const token = await fastify.database.get(
			'SELECT * FROM refresh_tokens WHERE user_id = ? AND session_id = ?',
			id,
			sessionId,
		);

		return token;
	}

	async deleteToken(id: number, sessionId: string) {
		const del = await fastify.database.run(
			'DELETE FROM refresh_tokens WHERE user_id = ? AND session_id = ?',
			id,
			sessionId,
		);

		return del.changes;
	}

	async insertBlackToken(sessionId: string, token: string) {
		const resToken = await fastify.database.run(
			'INSET INTO black_tokens (session_id, token) VALUES (?, ?)',
			sessionId,
			token,
		);

		return resToken?.lastID;
	}

	async getBlackToken(sessionId: string): Promise<any | undefined> {
		const bToken = await fastify.database.get(
			'SELECT * FROM black_tokens WHERE session_id = ?',
		);

		return bToken;
	}
}

export default AuthRepository;
