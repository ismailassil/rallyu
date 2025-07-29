import fastify from '../app.js';
import NotifRepository from '../repositories/notif.repository.js';
import NotificationPayload, {
	ClientNotification,
	NotificationDetail,
} from '../shared/types/notifications.types.js';
import { NotificationUpdate } from '../shared/types/request.types.js';

class NotifSerives {
	private notifRepository: NotifRepository;

	constructor() {
		this.notifRepository = new NotifRepository();
	}

	async createAndDispatchNotification(
		payload: NotificationPayload,
	): Promise<void> {
		const { recipientId } = payload;

		const resData = await this.registerNotification(payload);
		fastify.log.info('✅ Notification created');

		fastify.nats.publish(
			'notification.notify',
			fastify.jc.encode({
				userId: recipientId,
				data: resData,
			}),
		);

		await fastify.nats.flush();
	}

	async getUserMessages(
		userId: string,
		page: number,
	): Promise<NotificationDetail[]> {
		const data: NotificationDetail[] = await this.notifRepository.getMessages(
			parseInt(userId),
			page,
		);

		return data;
	}

	async updateAndDispatchNotification(
		userId: number,
		payload: NotificationUpdate,
	): Promise<void> {
		const { notificationId, scope, status } = payload;

		await this.updateNotification(userId, payload);
		fastify.log.info('✅ Notification updated');

		fastify.nats.publish(
			'notification.update',
			fastify.jc.encode({
				userId,
				notificationId,
				scope,
				status,
			}),
		);

		await fastify.nats.flush();
	}

	async updateNotification(userId: number, payload: NotificationUpdate) {
		const { notificationId, scope, status } = payload;

		if (scope === 'all') {
			await this.notifRepository.updateAllNotif(status, userId);
		} else {
			await this.notifRepository.updateNotif(status, userId, notificationId);
		}
	}

	async unpackMessages(
		fullData: NotificationDetail[],
	): Promise<ClientNotification[]> {
		return Promise.all(fullData.map(this.filterMessage));
	}

	private async filterMessage(
		data: NotificationDetail,
	): Promise<ClientNotification> {
		const res = await fastify.nats.request(
			'user.image',
			fastify.jc.encode({ userId: data.senderId }),
		);

		const avatar = fastify.jc.decode(res.data);

		return {
			id: data.id,
			senderUsername: data.senderUsername,
			recipientUsername: data.recipientUsername,
			content: data.content,
			type: data.type,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			status: data.status,
			actionUrl: data.actionUrl,
			avatar: avatar,
		};
	}

	private async registerNotification(
		payload: NotificationPayload,
	): Promise<NotificationDetail> {
		const { senderId, recipientId } = payload;

		const resOne = await fastify.nats.request(
			'user.username',
			fastify.jc.encode({ userId: senderId }),
		);
		const resTwo = await fastify.nats.request(
			'user.username',
			fastify.jc.encode({ userId: recipientId }),
		);

		const senderUsername = fastify.jc.decode(resOne.data);
		const recipientUsername = fastify.jc.decode(resTwo.data);

		// Register the Notification Message
		const data: NotificationDetail = await this.notifRepository.registerMessage(
			payload,
			senderUsername,
			recipientUsername,
		);

		return data;
	}
}

export default NotifSerives;
