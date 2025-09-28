import type { FastifyReply, FastifyRequest } from 'fastify';
import fastify from '@/app.js';
import NotifServices from '@/services/notif.services.js';
import type { IFetchQuery } from '@/shared/types/request.types.js';
import type {
	RAW_NOTIFICATION,
	USER_NOTIFICATION,
} from '../shared/types/notifications.types.js';

class NotifControllers {
	private notifServices: NotifServices;

	constructor() {
		this.notifServices = new NotifServices();

		fastify.decorate('notifService', this.notifServices);
	}

	async getNotificationHistory(
		req: FastifyRequest<{ Querystring: IFetchQuery }>,
		res: FastifyReply,
	) {
		const userId = req.headers['x-user-id'] as string;
		const { page } = req.query;

		if (!userId)
			return res.status(400).send({
				status: 'error',
				message: 'Error Occurred',
				details: 'x-user-id Empty',
			});

		try {
			const fullData: RAW_NOTIFICATION[] =
				await this.notifServices.getUserMessages(userId, page);

			const data: USER_NOTIFICATION[] =
				await this.notifServices.unpackMessages(fullData);

			return res.status(200).send({ status: 'success', message: data });
		} catch (err) {
			return res.status(500).send({
				status: 'error',
				message: 'Error occurred',
				details: err,
			});
		}
	}
}

export default NotifControllers;
