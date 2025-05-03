import fastifyJwt, { FastifyJWT } from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import refreshTokenHook from '../Hooks/refreshTokenHook';
import authenticationHook from '../Hooks/authenticationHook';

const jwtPlugin = fp(async function (fastify: FastifyInstance) {
	fastify.register(fastifyJwt, {
		secret: process.env.JWT_REFRESHTOKEN_EXPIRATION || 'something_not_safe',
	});

	fastify.decorate('authenticate', authenticationHook);
	fastify.decorate('authRefreshToken', refreshTokenHook);
});

export default jwtPlugin;
