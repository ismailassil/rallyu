import fastify from '../app.js';
import NotifRepository from '../repositories/notif.repository.js';
import {
	NOTIFY_USER_PAYLOAD,
	RAW_NOTIFICATION,
	USER_NOTIFICATION,
} from '../shared/types/notifications.types.js';
import { UPDATE_NOTIFICATION } from '../shared/types/request.types.js';

class NotifSerives {
	private notifRepository: NotifRepository;

	constructor() {
		this.notifRepository = new NotifRepository();
	}

	async getUserMessages(
		userId: string,
		page: number,
	): Promise<RAW_NOTIFICATION[]> {
		const data: RAW_NOTIFICATION[] = await this.notifRepository.getMessages(
			parseInt(userId),
			page,
		);

		return data;
	}

	async createAndDispatchNotification(
		payload: NOTIFY_USER_PAYLOAD,
	): Promise<void> {
		const { receiverId } = payload;

		const resData = await this.registerNotification(payload);
		fastify.log.info('✅ Notification created');
		
		const data = await this.filterMessage(resData);
		
		// ********************************* */
		// ** PAYLOAD TO SEND THROUGH `NATS`
		// ********************************* */
		const resPayload = { userId: receiverId, data };

		const res = fastify.jc.encode(resPayload);

		fastify.nats.publish('gateway.notification.notify', res);
	}

	async updateAndDispatchNotification(
		userId: number,
		payload: UPDATE_NOTIFICATION,
	): Promise<void> {
		const { notificationId, scope, status } = payload;

		await this.updateNotification(userId, payload);
		fastify.log.info('✅ Notification updated');

		// ********************************* */
		// ** PAYLOAD TO SEND THROUGH `NATS`
		// ********************************* */
		const resPayload = {
			userId,
			data: { notificationId, scope, status } as UPDATE_NOTIFICATION,
		};
		
		const res = fastify.jc.encode(resPayload);
		
		fastify.nats.publish('gateway.notification.update', res);
	}
	
	async updateNotification(userId: number, payload: UPDATE_NOTIFICATION) {
		const { notificationId, scope, status } = payload;
		
		if (scope === 'all') {
			await this.notifRepository.updateAllNotif(status, userId);
		} else {
			await this.notifRepository.updateNotif(status, userId, notificationId);
		}
	}
	
	async unpackMessages(
		fullData: RAW_NOTIFICATION[],
	): Promise<USER_NOTIFICATION[]> {
		return Promise.all(fullData.map(this.filterMessage));
	}
	
	private async filterMessage(data: RAW_NOTIFICATION): Promise<USER_NOTIFICATION> {
		const res = await fastify.nats.request(
			'user.image',
			fastify.jc.encode({ userId: data.sender_id }),
		);
		
		const avatar = fastify.jc.decode(res.data);
		
		return {
			id: data.id,
			senderId: data.sender_id,
			senderUsername: data.sender_username,
			receiverId: data.receiver_id,
			content: data.content,
			type: data.type,
			createdAt: data.created_at,
			updatedAt: data.updated_at,
			status: data.status,
			actionUrl: data.action_url,
			avatar: avatar,
		};
	}
	
	private async registerNotification(
		payload: NOTIFY_USER_PAYLOAD,
	): Promise<RAW_NOTIFICATION> {
		const { senderId } = payload;
		
		const senderUser = await fastify.nats.request(
			'user.username',
			fastify.jc.encode({ user_id: senderId }),
		);
		
		const senderUsername = fastify.jc.decode(senderUser.data);
		
		const data: RAW_NOTIFICATION = await this.notifRepository.registerMessage(
			payload,
			senderUsername,
		);
		
		return data;
	}
}

export default NotifSerives;
