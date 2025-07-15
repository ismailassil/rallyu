import { FastifyInstance, FastifyReply } from 'fastify';
import ChatControllers from '../controllers/chat.controllers';
import fetchSchema from '../shared/schemas/fetch.schema';
import { ParamsFetchChatsTypes } from '../shared/types/fetchChats.types';

function chatRoutes(fastify: FastifyInstance) {
	const chatControllers = new ChatControllers();

	fastify.get(
		'/health',
		{ exposeHeadRoute: false },
		function (_, res: FastifyReply) {
			return res.status(200).send({ status: 'up' });
		},
	);

	// TODO: Add schemas
	fastify.get<{ Params: ParamsFetchChatsTypes }>(
		'/:username',
		{ schema: fetchSchema, exposeHeadRoute: false },
		chatControllers.getUserChats.bind(chatControllers),
	);

	// TODO: Add Schams, can pass queries
	fastify.get(
		'/search',
		{ exposeHeadRoute: false },
		chatControllers.searchUsers.bind(chatControllers),
	);
}

export default chatRoutes;
