import AuthRepository from '../../auth/Repositories/AuthRepository.js';
import { app as fastify } from '../../app.js';
import { signUpType, TokenType, userJWT } from '../../auth/Repositories/types.js';
import { FastifyJWT } from '@fastify/jwt';

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
			username: username,
			role: 'user',
		};
	}

	public async registerToken(user: userJWT, deviceInfo: string | undefined) {
		const refreshToken = await this.createToken(user, 'refresh');
		const accessToken = await this.createToken(user, 'access');

		const hashedToken = await fastify.bcrypt.hash(refreshToken);
		const userId = await this.authRepository.insertToken(
			hashedToken,
			user.id,
			deviceInfo,
		);

		if (!userId) throw new Error('Unknow Error Occurred.');

		return { refreshToken, accessToken };
	}

	public async createToken(
		user: userJWT,
		tokenType: 'refresh' | 'access',
	): Promise<string> {
		let jwtKey = process.env.JWT_REFRESHTOKEN_KEY || 'notASafeKey';
		let exp = process.env.JWT_ACCESSTOKEN_EXPIRATION || '25m';

		return fastify.jwt.sign(
			{ payload: user },
			{
				key: jwtKey,
				expiresIn: exp,
			},
		);
	}

	public async verifyToken(
		token: string,
		deviceInfo: string,
		tokenSource: 'header' | 'cookie',
	) {
		try {
			const user = fastify.jwt.verify<FastifyJWT['user']>(token);

			if (tokenSource === 'header') return user;

			const tokenInfo = await this.authRepository.getToken(user.id);
			if (!tokenInfo) throw new Error('Unknown Refresh Token');

			if (tokenInfo.device_info !== deviceInfo) {
				throw new Error('Device info mismatch for refresh token.');
			}

			return user;
		} catch (err) {
			throw new Error(
				(err as Error)?.message || 'Unknown error `authentication`',
			);
		}
	}
}

export default AuthServices;
