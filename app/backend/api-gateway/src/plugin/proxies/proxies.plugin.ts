import { FastifyInstance } from 'fastify';
import proxy from '@fastify/http-proxy';
import fp from 'fastify-plugin';
import { proxiesOpts } from './proxies.types';

const endpointsPlugin = fp(async (fastify: FastifyInstance, opts: proxiesOpts) => {
	const { AUTH_PORT, NOTIF_PORT, CHAT_PORT, XO_PORT } = opts;

	//// AUTH & USERS //////////////////////////////////
	const authProxyOptions = {
		// upstream: `http://auth:${AUTH_PORT}`,
		// upstream: `http://host.docker.internal:${AUTH_PORT}`,
		upstream: `http://ms-auth:${AUTH_PORT}`,
		prefix: '/api/auth',
		rewritePrefix: '/auth',
		httpMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
	};

	const usersProxyOptions = {
		// upstream: `http://auth:${AUTH_PORT}`,
		upstream: `http://ms-auth:${AUTH_PORT}`,
		// upstream: `http://host.docker.internal:${AUTH_PORT}`,
		prefix: '/api/users',
		rewritePrefix: '/users',
		httpMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
	};
	//////////////////////////////////

	const notifProxyOptions = {
		// upstream: `http://notif:${NOTIF_PORT}`,
		// upstream: `http://ms-notif:${NOTIF_PORT}`,
		upstream: `http://host.docker.internal:${NOTIF_PORT}`,
		prefix: '/api/notif',
		rewritePrefix: '/notif',
		httpMethods: ['GET', 'PUT'],
	};

	const chatProxyOptions = {
		// upstream: `http://chat:${CHAT_PORT}`,
		upstream: `http://ms-chat:${CHAT_PORT}`,
		prefix: '/api/chat',
		rewritePrefix: '/chat',
		httpMethods: ['GET', 'PUT'],
	};

	const xoGameProxyOptions = {
		upstream: `http://ms-xo:${XO_PORT}`,
		prefix: `/api/xo`,
		rewritePrefix: '/xo',
		httpMethods: ['GET', 'PUT'],
	};

	await fastify.register(proxy, authProxyOptions);
	await fastify.register(proxy, usersProxyOptions);
	await fastify.register(proxy, notifProxyOptions);
	await fastify.register(proxy, chatProxyOptions);
	await fastify.register(proxy, xoGameProxyOptions);
});

export default endpointsPlugin;
