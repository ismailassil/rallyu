import AuthRepository from '../repositories/auth.repository.js';
import { app as fastify } from '../../app.js';
import { signUpType, TokenType, userJWT } from '../repositories/types.js';
import { randomUUID } from 'crypto';

class AuthServices {
	private authRepository = new AuthRepository();

	public async verifyUser(username: string, password: string): Promise<userJWT> {
		if (fastify.isEmpty(username, password))
			throw new Error('username and password are required.');
		const user = await this.authRepository.getPasswordByUsername(username);

		if (!user) throw new Error('Invalid credentials.');

		const isPasswordValid = await fastify.bcrypt.compare(
			password,
			user.password,
		);
		if (!isPasswordValid) throw new Error('Invalid credentials.');

		return {
			id: user.id,
			sessionId: randomUUID(),
			username: username,
			role: user.role,
		};
	}

	public async registerUser(userInfo: signUpType): Promise<userJWT> {
		const { username, password } = userInfo;

		const isUserExist = await this.authRepository.getUserByUsername(username);
		if (isUserExist) throw new Error('Username already exists');

		if (!fastify.userChecker(username)) throw new Error('Invalid username.');
		if (!fastify.pwdCheker(password)) throw new Error('Invalid password.');

		const hashedPassword = await fastify.bcrypt.hash(password);

		const userId = await this.authRepository.insertNewUser(
			userInfo,
			hashedPassword,
		);

		if (!userId) throw new Error('Unknow Error Occurred.');

		return {
			id: userId,
			sessionId: randomUUID(),
			username: username,
			role: 'user',
		};
	}

	public async registerToken(user: userJWT, ip: string, deviceInfo: string) {
		const refreshToken = await this.createToken(user, 'cookie');
		const accessToken = await this.createToken(user, 'header');

		const hashedToken = await fastify.bcrypt.hash(refreshToken);
		const result = await this.authRepository.insertToken(
			hashedToken,
			user.id,
			user.sessionId,
			ip,
			deviceInfo,
		);

		if (!result) throw new Error('Unknow Error Occurred.');

		return { refreshToken, accessToken };
	}

	public async createToken(
		user: userJWT,
		source: 'cookie' | 'header',
	): Promise<string> {
		const jwtKey =
			source === 'cookie'
				? process.env.JWT_REFRESHTOKEN_KEY || 'notASafeKey'
				: process.env.JWT_ACCESSTOKEN_KEY || 'notThateasy';
		const exp =
			source === 'cookie'
				? process.env.JWT_REFRESHTOKEN_EXPIRATION || '25d'
				: process.env.JWT_ACCESSTOKEN_EXPIRATION || '25m';

		return fastify.jwt.sign({ payload: user }, { key: jwtKey, expiresIn: exp });
	}

	public async registerNewRefreshToken(
		user: userJWT,
		ip: string,
		deviceInfo: string,
	) {
		const ruid = randomUUID();
		const newPayload: userJWT = {
			id: user.id,
			username: user.username,
			sessionId: ruid,
			role: user.role,
		};

		const token = await this.createToken(newPayload, 'cookie');
		const hashedToken = await fastify.bcrypt.hash(token);
		const result = await this.authRepository.insertToken(
			hashedToken,
			user.id,
			ruid,
			ip,
			deviceInfo,
		);

		if (!result) throw new Error('Unknow Error Occurred.');

		return token;
	}

	public async addToBlacklist(user: userJWT) {
		// The Token is Encrypted
		try {
			const tokenInfo = await this.authRepository.getToken(
				user.id,
				user.sessionId,
			);
			if (!tokenInfo) throw new Error('Unknown Refresh Token.');

			const result = await this.authRepository.insertBlackToken(
				user.sessionId,
				tokenInfo.token,
			);
			if (!result) throw new Error('Unknow Error Occurred.');
		} catch (err) {
			throw new Error((err as Error)?.message || 'Unknown Error Occurred.');
		}
	}

	public async verifyToken(
		token: string,
		deviceInfo: string,
		ipAddress: string,
		source: 'header' | 'cookie',
	) {
		const jwtKey =
			source === 'cookie'
				? process.env.JWT_REFRESHTOKEN_KEY || 'notASafeKey'
				: process.env.JWT_ACCESSTOKEN_KEY || 'notThateasy';

		try {
			const decode = fastify.jwt.verify(token, {
				key: jwtKey,
			});

			const user = (decode as { payload: userJWT }).payload;

			if (!user) throw new Error('Token is null or undefined');

			if (source === 'header') return user;

			const tokenInfo = await this.authRepository.getToken(
				user.id,
				user.sessionId,
			);
			if (!tokenInfo)
				throw new Error(
					'Unknown Refresh TokenDROP TABLE IF EXISTS refresh_tokens;.',
				);

			// check if the token is blacklisted or not?
			this.verifyIsBlackToken(user.sessionId, token);

			if (tokenInfo.device_info !== deviceInfo || tokenInfo.ip !== ipAddress) {
				throw new Error('Device info or IP mismatch for refresh token.');
			}

			return user;
		} catch (err) {
			throw new Error(
				(err as Error)?.message || 'Unknown error `authentication`.',
			);
		}
	}

	public async verifyIsBlackToken(sessionId: string, token: string) {
		const blackToken = await this.authRepository.getBlackToken(sessionId);

		if (blackToken) {
			const isValid = await fastify.bcrypt.compare(token, blackToken.token);
			if (isValid) throw new Error('Token is Blacklisted.');
		}
	}

	public async revokeToken(user: userJWT) {
		try {
			this.authRepository.deleteToken(user.id, user.sessionId);
		} catch (error) {
			throw new Error(`Unknow Error: ${String(error)}`);
		}
	}

	public async changePassword(user: userJWT, oldpwd: string, newpwd: string) {
		const { id, username } = user;

		try {
			const userDb = await this.authRepository.getUserByUsername(username);
			if (!userDb) throw new Error('User not found.');

			const pass = await this.authRepository.getPasswordByUsername(username);
			if (!pass) throw new Error('Password not found.');

			const isValid = fastify.bcrypt.compare(oldpwd, pass.password);
			if (!isValid) {
				throw new Error('Passowrd is not valid');
			}

			if (!fastify.pwdCheker(newpwd)) throw new Error('Invalid password.');

			const hashedpwd = await fastify.bcrypt.hash(newpwd);

			const update = await this.authRepository.updatePassword(hashedpwd, id);

			if (!update) {
				throw new Error('Error Occurred while updating');
			}
		} catch (error) {
			const errorMsg = (error as Error)?.message || 'Unknown Error Occurred.';
			throw new Error(errorMsg);
		}
	}
}

export default AuthServices;
