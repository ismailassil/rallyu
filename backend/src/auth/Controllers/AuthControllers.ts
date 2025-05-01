import { signUpType } from '../../auth/Repositories/types.js';
import AuthServices from '../../auth/Services/AuthServices.js';
import { FastifyReply, FastifyRequest } from 'fastify';
import { app as fastify } from '../../app.js';

class AuthController {
	private authService = new AuthServices();

	async login(req: FastifyRequest, res: FastifyReply): Promise<void> {
		const { username, password } = req.body as {
			username: string;
			password: string;
		};

		try {
			const user = await this.authService.verifyUser(username, password);
			const token = await this.authService.createToken(user);
			return res
				.status(200)
				.send({ success: true, message: 'Login Successful', token });
		} catch (err) {
			return res.status(500).send({
				error:
					(err as Error)?.message ||
					'An Unknown error occurred during Authorization',
			});
		}
	}

	async register(req: FastifyRequest, res: FastifyReply): Promise<void> {
		const userInfo = req.body as signUpType;

		try {
			const user = await this.authService.registerUser(userInfo);
			const token = await this.authService.createToken(user);

			return res.status(201).send({
				success: true,
				message: 'Registation Successful',
				token,
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
		// Logic for user logout
	}

	async forgotPassword(
		req: FastifyRequest,
		res: FastifyReply,
	): Promise<void> {
		// Logic for password recovery
	}

	async resetPassword(req: FastifyRequest, res: FastifyReply): Promise<void> {
		// Logic for resetting the password
	}

	async verifyEmail(req: FastifyRequest, res: FastifyReply): Promise<void> {
		// Logic for email verification
	}

	async changePassword(
		req: FastifyRequest,
		res: FastifyReply,
	): Promise<void> {
		// Logic for changing the password
	}
}

export default AuthController;
