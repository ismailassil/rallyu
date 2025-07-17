import { FastifyReply, FastifyRequest } from 'fastify';
import fastify from '../app.js';
import NotifServices from '../services/notif.services.js';
import INotifyBody from '../shared/types/notifyBody.types.js';
import {
	IFetchParams,
	IFetchQuery,
	INotifDetail,
} from '../shared/types/fetch.types.js';
import IUpdateBody from '../shared/types/update.types.js';
import INotifMessage from '../shared/types/notifMessage.types.js';
import { UserNotFoundException } from '../shared/exceptions/UserNotFoundException.js';
import { NotificationNotFoundException } from '../shared/exceptions/NotificationNotFoundException.js';
import { JSONCodec } from 'nats';

class NotifControllers {
	private notifServices: NotifServices;

	constructor() {
		this.notifServices = new NotifServices();
	}

	async notify(
		req: FastifyRequest<{ Body: INotifyBody }>,
		res: FastifyReply,
	): Promise<void> {
		// Register the notification in the Database
		let notifId: number;
		try {
			notifId = await this.notifServices.registerNotification(req.body);
			fastify.log.info('✅ Notification created');

			// Get the Data from Redis
			const result = await fastify.redis.get(`notif?id=${notifId}`);
			if (!result) {
				return res
					.status(404)
					.send({ status: 'error', message: 'Notification not found' });
			}

			// Parse the Notification
			const resData: INotifDetail = JSON.parse(result);

			// Send back to API & SocketIO Gateway through NATS Server
			const jc = JSONCodec();
			fastify.nats.publish(
				'notification',
				jc.encode({
					username: req.body.to_user,
					type: 'notify',
					data: resData,
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

	// Limit-Offset Pagination
	// ?? PATH/:username&page=?
	async fetchHistory(
		req: FastifyRequest<{ Params: IFetchParams; Querystring: IFetchQuery }>,
		res: FastifyReply,
	) {
		const { username } = req.params;
		const { page } = req.query;

		try {
			const fullData: INotifMessage[] =
				await this.notifServices.getUserMessages(username, page);

			const data: INotifDetail[] =
				this.notifServices.unpackMessage(fullData);

			return res.status(200).send({ status: 'success', message: data });
		} catch (err) {
			if (err instanceof UserNotFoundException) {
				return res
					.status(404)
					.send({ status: 'error', message: err.message });
			}
			return res.status(500).send({
				status: 'error',
				message: 'Error occurred',
				details: err,
			});
		}
	}

	async updateNotification(
		req: FastifyRequest<{
			Body: IUpdateBody;
		}>,
		res: FastifyReply,
	) {
		const { notificationId, status, username, all } = req.body;

		try {
			// Update the Notification in DB
			await this.notifServices.updateNotification(req.body);
			fastify.log.info('✅ Notification updated');

			// Send back to API & SocketIO Gateway through NATS Server
			const jc = JSONCodec();
			fastify.nats.publish(
				'notification',
				jc.encode({
					username: username,
					type: 'update',
					data: {
						notifStatus: status,
						notifType: all || notificationId,
					},
				}),
			);
			try {
				fastify.nats.flush();
				fastify.log.info('✅ Notification => `Gateway`');
			} catch {
				fastify.log.error('❌ Notification => `Gateway`');
			}

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
