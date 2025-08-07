import fastifyJwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import refreshTokenHook from '../hooks/useRefreshtoken.js';
import authenticationHook from '../hooks/useAuthentication.js';
import AuthServices from '../../services/auth.services.js';

const jwtPlugin = fp(async function (fastify: FastifyInstance) {
	fastify.register(fastifyJwt, {
		secret: process.env.JWT_REFRESHTOKEN_EXPIRATION || 'something_not_safe',
	});

	const authService = new AuthServices();

	fastify.decorate('authenticate', authenticationHook.bind(authService));
	fastify.decorate('authRefreshToken', refreshTokenHook.bind(authService));
});

export default jwtPlugin;
