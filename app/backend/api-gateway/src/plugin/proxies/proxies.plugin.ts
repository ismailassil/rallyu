import type { FastifyInstance } from 'fastify';
import proxy from '@fastify/http-proxy';
import fp from 'fastify-plugin';
import type { proxiesOpts } from './proxies.types.js';

const endpointsPlugin = fp(async (fastify: FastifyInstance, opts: proxiesOpts) => {
	const { AUTH_PORT, NOTIF_PORT, CHAT_PORT, XO_PORT, TOURNAMENT_PORT, MATCHMAKING_PORT, GAME_PORT } = opts;

	//// AUTH & USERS //////////////////////////////////
	const authProxyOptions = {
		upstream: `http://ms-auth:${AUTH_PORT}`,
		// upstream: `http://host.docker.internal:${AUTH_PORT}`,
		prefix: '/api/auth',
		rewritePrefix: '/auth',
		httpMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
	};

	const usersProxyOptions = {
		upstream: `http://ms-auth:${AUTH_PORT}`,
		// upstream: `http://host.docker.internal:${AUTH_PORT}`,
		prefix: '/api/users',
		rewritePrefix: '/users',
		httpMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
	};
	//////////////////////////////////

	const notifProxyOptions = {
		upstream: `http://ms-notif:${NOTIF_PORT}`,
		// upstream: `http://host.docker.internal:${NOTIF_PORT}`,
		prefix: '/api/notif',
		rewritePrefix: '/notif',
		httpMethods: ['GET', 'POST'],
	};

	const chatProxyOptions = {
		upstream: `http://ms-chat:${CHAT_PORT}`,
		// upstream: `http://host.docker.internal:${CHAT_PORT}`,
		prefix: '/api/chat',
		rewritePrefix: '/chat',
		httpMethods: ['GET', 'PUT'],
	};

	const xoGameProxyOptions = {
		upstream: `http://ms-xo:${XO_PORT}`,
		// upstream: `http://host.docker.internal:${XO_PORT}`,
		prefix: `/api/xo`,
		rewritePrefix: '/xo',
		httpMethods: ['GET', 'PUT'],
	};

	const tournamentProxyOptions = {
		upstream: `http://ms-tournament:${TOURNAMENT_PORT}`,
		// upstream: `http://host.docker.internal:${TOURNAMENT_PORT}`,
		prefix: `/api/v1/tournament`,
		rewritePrefix: `/api/v1/tournament`,
		httpMethods: ['GET', 'POST', 'PATCH'],
	}

	const commonMatchMakingOptions = {
		upstream: `http://ms-matchmaking:${MATCHMAKING_PORT}`,
		httpMethods: ['GET', 'POST'],
		rewritePrefix: '/api/v1/matchmaking',
		websocket: true,
	}

	const commonGameOptions = {
		upstream: `http://ms-game:${GAME_PORT}`,
		httpMethods: ['GET', 'POST'],
		rewritePrefix: '/game',
		websocket: true,
	}

	const matchmakingProxyOptions = {
		...commonMatchMakingOptions,
		prefix: '/api/v1/matchmaking',
	}

	const matchmakingWsProxyOptions = {
		...commonMatchMakingOptions,
		prefix: '/api-ws/matchmaking',
	}
	
	const gameProxyOptions = {
		...commonGameOptions,
		prefix: '/api/game',
	}
	const gameWsProxyOptions = {
		...commonGameOptions,
		prefix: '/api-ws/game',
	}

	await fastify.register(proxy, authProxyOptions);
	await fastify.register(proxy, usersProxyOptions);
	await fastify.register(proxy, notifProxyOptions);
	await fastify.register(proxy, chatProxyOptions);
	await fastify.register(proxy, xoGameProxyOptions);
	await fastify.register(proxy, tournamentProxyOptions);
	await fastify.register(proxy, matchmakingProxyOptions);
	await fastify.register(proxy, gameProxyOptions);
	await fastify.register(proxy, matchmakingWsProxyOptions);
	await fastify.register(proxy, gameWsProxyOptions);
});

export default endpointsPlugin;
