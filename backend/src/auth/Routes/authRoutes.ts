import { FastifyInstance } from 'fastify';
import AuthController from '../Controllers/AuthControllers.js';
import loginSchema from '../Schemas/loginSchema.js';
import registerSchema from '../Schemas/registerSchema.js';
import ILoginBody from './generics/ILoginBody.js';
import IRegisterBody from './generics/IRegisterBody.js';

const routes: { [key: string]: string } = {
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
	fastify.post(
		routes.logout,
		{ preHandler: fastify.jwtAuth },
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
		authController.changePassword.bind(authController),
	);
}

export default authRoutes;
