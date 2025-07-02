import notifySchema from '../shared/schemas/notification.schema.js';
import NotifControllers from '../controllers/notif.controllers.js';
import { FastifyInstance, FastifyReply } from 'fastify';

const NotifRoutes = async (fastify: FastifyInstance) => {
	const notifControllers = new NotifControllers();

	fastify.get('/health', (_, res: FastifyReply) => {
		res.status(200).send({ status: 'up' });
	});

	fastify.post(
		'/notify',
		{ schema: notifySchema },
		notifControllers.notify.bind(notifControllers),
	);

	fastify.get(
		'/history/:username',
		// TODO: add schema for validating the params and queries { schema: }
		// Params: IFetchParams; Querystring: IFetchQuery
		notifControllers.fetchHistory.bind(notifControllers),
	);

	fastify.put(
		'/update',
		// TODO: add schema for validating the body { schema: }
		notifControllers.updateNotification.bind(notifControllers),
	);
};

export default NotifRoutes;
