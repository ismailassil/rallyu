import { FastifyInstance } from 'fastify';
import AuthController from '../controllers/auth.controllers.js';
import loginSchema from '../shared/schemas/login.schema.js';
import registerSchema from '../shared/schemas/register.schema.js';
import ILoginBody from './types/login.body.js';
import IRegisterBody from './types/register.body.js';

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

	fastify.get(
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
		{ preHandler: fastify.authRefreshToken },
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
