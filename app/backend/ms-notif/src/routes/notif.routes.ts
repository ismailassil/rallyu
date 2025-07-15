import notifySchema from '../shared/schemas/notify.schema.js';
import NotifControllers from '../controllers/notif.controllers.js';
import { FastifyInstance, FastifyReply } from 'fastify';
import historySchema from '../shared/schemas/history.schema.js';
import updateSchema from '../shared/schemas/update.schema.js';

const NotifRoutes = async (fastify: FastifyInstance) => {
	const notifControllers = new NotifControllers();

	fastify.get('/health', { exposeHeadRoute: false }, (_, res: FastifyReply) => {
		res.status(200).send({ status: 'up' });
	});

	fastify.post(
		'/notify',
		{ schema: notifySchema },
		notifControllers.notify.bind(notifControllers),
	);

	fastify.get(
		'/history/:username',
		{ schema: historySchema, exposeHeadRoute: false },
		notifControllers.fetchHistory.bind(notifControllers),
	);

	fastify.put(
		'/update',
		{ schema: updateSchema },
		notifControllers.updateNotification.bind(notifControllers),
	);
};

export default NotifRoutes;
