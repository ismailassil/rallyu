import NotifControllers from '../controllers/notif.controllers.js';
import { FastifyInstance, FastifyReply } from 'fastify';
import historySchema from '../shared/schemas/history.schema.js';
import updateSchema from '../shared/schemas/update.schema.js';

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

	fastify.put(
		'/update',
		{ schema: updateSchema },
		notifControllers.updateNotification.bind(notifControllers),
	);
};

export default NotifRoutes;

/***
 * 
	fastify.post(
		'/notify',
		{ schema: notifySchema },
		notifControllers.notify.bind(notifControllers),
	);
 */