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
};

export default NotifRoutes;
