import { FastifyInstance } from 'fastify';
import proxy from '@fastify/http-proxy';
import fp from 'fastify-plugin';

const endpointsPlugin = fp(async (fastify: FastifyInstance, opts: endpointsOpts) => {
	const { AUTH_PORT, NOTIF_PORT } = opts;

	const authProxyOptions = {
		// upstream: `http://auth:${AUTH_PORT}`,
		upstream: `http://localhost:${AUTH_PORT}`,
		prefix: '/api/auth',
		rewritePrefix: '/auth',
		httpMethods: ['GET', 'POST', 'DELETE', 'PUT'],
	};

	const notifProxyOptions = {
		// upstream: `http://notif:${NOTIF_PORT}`,
		upstream: `http://localhost:${NOTIF_PORT}`,
		prefix: '/api/notif',
		rewritePrefix: '/notif',
		httpMethods: ['GET', 'PUT'],
	};

	await fastify.register(proxy, authProxyOptions);

	await fastify.register(proxy, notifProxyOptions);
});

export default endpointsPlugin;
