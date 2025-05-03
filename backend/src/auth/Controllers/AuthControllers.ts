import { signUpType } from '../../auth/Repositories/types.js';
import AuthServices from '../../auth/Services/AuthServices.js';
import { FastifyReply, FastifyRequest } from 'fastify';
import ILoginBody from '../Routes/types/ILoginBody.js';

class AuthController {
	private authService = new AuthServices();

	async refreshToken(req: FastifyRequest, res: FastifyReply): Promise<void> {
		// When refreshing:
		// 1. Validate incoming refresh token
		// 2. Delete the old one
		// 3. Issue and store new refresh token
	}

	async login(req: FastifyRequest, res: FastifyReply): Promise<void> {
		const deviceInfo = req.headers['user-agent'];
		const { username, password } = req.body as ILoginBody;

		try {
			const user = await this.authService.verifyUser(username, password);
			const { refreshToken, accessToken } =
				await this.authService.registerToken(user, deviceInfo);

			res.setRefreshTokenCookie(refreshToken);

			return res
				.status(200)
				.send({ success: true, message: 'Login Successful', accessToken });
		} catch (err) {
			return res.status(500).send({
				error:
					(err as Error)?.message ||
					'An Unknown error occurred during Authorization',
			});
		}
	}

	async register(req: FastifyRequest, res: FastifyReply): Promise<void> {
		const deviceInfo = req.headers['user-agent'];
		const userInfo = req.body as signUpType;

		try {
			const user = await this.authService.registerUser(userInfo);
			const { refreshToken, accessToken } =
				await this.authService.registerToken(user, deviceInfo);

			res.setRefreshTokenCookie(refreshToken);

			return res.status(201).send({
				success: true,
				message: 'Registation Successful',
				accessToken,
			});
		} catch (err) {
			return res.status(500).send({
				error:
					(err as Error)?.message ||
					'An Unknow error occurred during Authorization',
			});
		}
	}

	async logout(req: FastifyRequest, res: FastifyReply): Promise<void> {
		// Mark all user's tokens as revoked

		res.clearCookie('refresh_token', {
			path: '/api',
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
		});

		// this.revokeToken();

		return res.send({ message: 'Logout successful' });
	}

	async forgotPassword(req: FastifyRequest, res: FastifyReply): Promise<void> {
		// Logic for password recovery
	}

	async resetPassword(req: FastifyRequest, res: FastifyReply): Promise<void> {
		// Automatically revoke all existing sessions
		// Logic for resetting the password
	}

	async verifyEmail(req: FastifyRequest, res: FastifyReply): Promise<void> {
		// Logic for email verification
	}

	async changePassword(req: FastifyRequest, res: FastifyReply): Promise<void> {
		// Logic for changing the password
	}
}

export default AuthController;
