import { FastifyReply, FastifyRequest } from 'fastify';
import fastify from '../app.js';
import NotifServices from '../services/notif.services.js';
import { NotificationNotFoundException } from '../shared/exceptions/NotificationNotFoundException.js';
import { IFetchQuery, UPDATE_NOTIFICATION } from '../shared/types/request.types.js';
import { RAW_NOTIFICATION, USER_NOTIFICATION } from '../shared/types/notifications.types.js';

class NotifControllers {
	private notifServices: NotifServices;

	constructor() {
		this.notifServices = new NotifServices();

		fastify.decorate("notifService", this.notifServices);
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

	async updateNotification(
		req: FastifyRequest<{
			Body: UPDATE_NOTIFICATION;
		}>,
		res: FastifyReply,
	) {
		const userId = req.headers['x-user-id'] as string;

		if (!userId)
			return res.status(400).send({
				status: 'error',
				message: 'Error Occurred',
				details: 'x-user-id Empty',
			});

		try {
			await this.notifServices.updateAndDispatchNotification(
				parseInt(userId),
				req.body,
			);

			return res
				.status(201)
				.send({ status: 'success', message: 'Updated Successfully' });
		} catch (err) {
			if (err instanceof NotificationNotFoundException) {
				return res
					.status(404)
					.send({ status: 'error', message: err.message });
			}
			return res
				.status(500)
				.send({ status: 'error', message: 'Error occurred', details: err });
		}
	}
}

export default NotifControllers;
