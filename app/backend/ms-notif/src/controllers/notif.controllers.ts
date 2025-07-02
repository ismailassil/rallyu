import { FastifyReply, FastifyRequest } from 'fastify';
import fastify from '../app.js';
import NotifServices from '../services/notif.services.js';
import INotifyBody from '../shared/types/notifyBody.types.js';
import { IFetchParams, IFetchQuery } from '../shared/types/fetch.types.js';
import IUpdateBody from '../shared/types/update.types.js';

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
				return res.status(404).send({ message: 'Notification not found' });
			}

			// Parse the Notification
			const resData = JSON.parse(result);

			// Emit notification event to all connected clients
			let userSocketId: string[] = this.notifServices.getSocketId(
				req.body.to_user,
			);
			this.notifServices.broadcastMessage(
				'notification',
				userSocketId,
				resData,
			);

			return res.status(201).send({ message: 'Notification created' });
		} catch (error) {
			return res.status(500).send({ message: 'Error occurred' });
		}
	}

	// Limit-Offset Pagination
	async fetchHistory(
		req: FastifyRequest<{ Params: IFetchParams; Querystring: IFetchQuery }>,
		res: FastifyReply,
	) {
		const { username } = req.params;
		const { limit, offset } = req.query;

		try {
			const data = await this.notifServices.getUserMessages(
				username,
				limit,
				offset,
			);

			return res.status(200).send({ messages: data });
		} catch (err) {
			return res.status(500).send({ message: 'Error occurred', error: err });
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

			// Let the other Connected Session update the changes real-time
			let userSocketId: string[] = this.notifServices.getSocketId(username);
			this.notifServices.broadcastMessage('update', userSocketId, [
				all || notificationId,
				status,
			]);

			return res.status(201).send({ message: 'Updated Successfully' });
		} catch (err) {
			return res.status(500).send({ message: 'Error occurred', error: err });
		}
	}
}

export default NotifControllers;
