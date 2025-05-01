import AuthRepository from '../../auth/Repositories/AuthRepository.js';
import { app as fastify } from '../../app.js';
import { signUpType, userJWT } from '../../auth/Repositories/types.js';

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

	public async createToken(user: userJWT): Promise<string> {
		return fastify.jwt.sign({ payload: user }, { expiresIn: '2d' });
	}
}

export default AuthServices;
