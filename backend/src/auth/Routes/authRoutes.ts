import { FastifyInstance } from 'fastify';
import AuthController from '../Controllers/AuthControllers.js';
import loginSchema from '../Schemas/loginSchema.js';
import registerSchema from '../Schemas/registerSchema.js';
import ILoginBody from './types/ILoginBody.js';
import IRegisterBody from './types/IRegisterBody.js';

const routes: { [key: string]: string } = {
	refresh_token: '/refresh-token',
	login: '/login',
	register: '/register',
	logout: '/logout',
	forgotPassword: '/forgot-password',
	resetPassword: '/reset-password',
	verifyEmail: '/verify-email',
	changePassword: '/change-password',
};

async function authRoutes(fastify: FastifyInstance) {
	const authController = new AuthController();

	fastify.post(
		routes.refresh_token,
		{ preHandler: fastify.authRefreshToken },
		authController.refreshToken.bind(authController),
	);
	fastify.post<{ Body: ILoginBody }>(
		routes.login,
		{ schema: loginSchema },
		authController.login.bind(authController),
	);
	fastify.post<{ Body: IRegisterBody }>(
		routes.register,
		{ schema: registerSchema },
		authController.register.bind(authController),
	);
	fastify.delete(
		routes.logout,
		{ preHandler: fastify.authenticate },
		authController.logout.bind(authController),
	);
	fastify.post(
		routes.verifyEmail,
		authController.verifyEmail.bind(authController),
	);
	fastify.post(
		routes.forgotPassword,
		authController.forgotPassword.bind(authController),
	);
	fastify.post(
		routes.changePassword,
		{ preHandler: fastify.authenticate },
		authController.changePassword.bind(authController),
	);
}

export default authRoutes;
