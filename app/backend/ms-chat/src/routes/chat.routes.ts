import { FastifyInstance, FastifyReply } from 'fastify';
import ChatControllers from '../controllers/chat.controllers';
import { QueryFetchChatsTypes } from '../shared/types/fetchChats.types';
import fetchHistorySchema from '../shared/schemas/fetchHistory.schema';

function chatRoutes(fastify: FastifyInstance) {
	const chatControllers = new ChatControllers();

	fastify.get(
		'/health',
		{ exposeHeadRoute: false },
		function (_, res: FastifyReply) {
			return res.status(200).send({ status: 'up' });
		},
	);

	fastify.get<{ Querystring: QueryFetchChatsTypes }>(
		'/history/chat',
		{ schema: fetchHistorySchema, exposeHeadRoute: false },
		chatControllers.getUserChatsHistory.bind(chatControllers),
	);

	// TODO: Add Schema, (+ Queries)
	fastify.get(
		'/search',
		{ exposeHeadRoute: false },
		chatControllers.searchUsers.bind(chatControllers),
	);
}

export default chatRoutes;
