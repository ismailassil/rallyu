import { signUpType, userJWT } from '../repositories/types.js';
import AuthServices from '../services/auth.services.js';
import { FastifyReply, FastifyRequest } from 'fastify';
import ILoginBody from '../routes/types/login.body.js';
import { app as fastify } from '../../app.js';
import { extractToken, unsignToken } from '../shared/utils/jwt.js';

class AuthController {
	private authService = new AuthServices();

	async refreshToken(req: FastifyRequest, res: FastifyReply): Promise<void> {
		// When refreshing:
		// 1. Validate incoming refresh token => Done in `RefreshTokenHook`
		// 2. Delete the old one
		const user = req.user;
		const deviceInfo = req.headers['user-agent'] || 'unknown';

		// 3. Issue and store new refresh token
		try {
			this.authService.revokeToken(user);
			const token: string = await this.authService.registerNewRefreshToken(
				user,
				deviceInfo,
			);

			res.setRefreshTokenCookie(token);

			return res
				.status(201)
				.send({ success: true, message: 'Token Generated Successfully' });
		} catch (error) {
			return res.status(500).send({
				error:
					(error as Error)?.message ||
					'Unknown error occurred during refreshToken',
			});
		}
	}

	async login(req: FastifyRequest, res: FastifyReply): Promise<void> {
		const deviceInfo = req.headers['user-agent'] || 'unknown';
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
		const deviceInfo = req.headers['user-agent'] || 'unknown';
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
		const payload = req.user;
		// Mark user's tokens as revoked

		try {
			this.authService.addToBlacklist(payload);
			this.authService.revokeToken(payload);

			res.clearCookie('refresh_token', {
				path: '/api',
				httpOnly: true,
				secure: false,
				sameSite: 'strict',
			});

			// delete the access_token from the front-end
			return res.send({ message: 'Logout successful' });
		} catch (err) {
			return res.status(500).send({
				error:
					(err as Error)?.message ||
					'An Unknow error occurred during Authorization',
			});
		}
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
