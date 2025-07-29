import { FastifyReply, FastifyRequest } from 'fastify';
import fastify from '../app.js';
import NotifServices from '../services/notif.services.js';
import {
	ClientNotification,
	NotificationDetail,
} from '../shared/types/notifications.types.js';
import { NotificationNotFoundException } from '../shared/exceptions/NotificationNotFoundException.js';
import { IFetchQuery, NotificationUpdate } from '../shared/types/request.types.js';

class NotifControllers {
	private notifServices: NotifServices;

	constructor() {
		this.notifServices = new NotifServices();
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
				details: 'x-user-username Empty',
			});

		try {
			const fullData: NotificationDetail[] =
				await this.notifServices.getUserMessages(userId, page);

			const data: ClientNotification[] =
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
			Body: NotificationUpdate;
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

/***
 * 
	async notify(
		req: FastifyRequest<{ Body: INotifyBody }>,
		res: FastifyReply,
	): Promise<void> {
		// Register the notification in the Database
		try {
			const notifData: INotifDetail =
				await this.notifServices.registerNotification(req.body);
			fastify.log.info('✅ Notification created');

			// Send back to API & SocketIO Gateway through NATS Server
			const jc = JSONCodec();
			fastify.nats.publish(
				'notification',
				jc.encode({
					username: req.body.to_user,
					type: 'notify',
					data: notifData,
				}),
			);
			try {
				await fastify.nats.flush();
				fastify.log.info('✅ Notification => `Gateway`');
			} catch {
				fastify.log.error('❌ Notification => `Gateway`');
			}

			return res
				.status(201)
				.send({ status: 'success', message: 'Notification created' });
		} catch (err) {
			return res
				.status(500)
				.send({ status: 'error', message: 'Error occurred', details: err });
		}
	}
 */
