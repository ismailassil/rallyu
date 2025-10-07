import NotifControllers from '@/controllers/notif.controllers.js';
import type { FastifyInstance, FastifyReply } from 'fastify';
import historySchema from '@/shared/schemas/history.schema.js';
import notifyGameSchema from '@/shared/schemas/notifyGame.schema.js';

const NotifRoutes = async (fastify: FastifyInstance) => {
	const notifControllers = new NotifControllers();

	fastify.get('/health', { exposeHeadRoute: false }, (_, res: FastifyReply) => {
		return res
			.status(200)
			.send({ status: 'up', timestamp: new Date().toISOString() });
	});

	fastify.get(
		'/history',
		{ schema: historySchema, exposeHeadRoute: false },
		notifControllers.getNotificationHistory.bind(notifControllers),
	);

	// fastify.post(
	// 	'/notify_game',
	// 	{ schema: notifyGameSchema, exposeHeadRoute: false },
	// 	notifControllers.notifyGame.bind(notifControllers),
	// );
};

export default NotifRoutes;
