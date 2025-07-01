import { FastifyReply, FastifyRequest } from 'fastify';
import fastify from '../app.js';
import NotifServices from '../services/notif.services.js';
import INotifyBody from '../shared/types/notifyBody.types.js';

class NotifControllers {
	notifServices: NotifServices;

	constructor() {
		this.notifServices = new NotifServices();
	}

	async notify(
		req: FastifyRequest<{ Body: INotifyBody }>,
		res: FastifyReply,
	): Promise<void> {
		// Register the notification in the Database
		this.notifServices.registerNotification(req.body);

		// Cache the notification in Redis

		// Deliver the Notification through SocketIO

		return res.code(201);
	}
}

export default NotifControllers;
