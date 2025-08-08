import fastify from '../app.js';
import NotifRepository from '../repositories/notif.repository.js';
import {
	NOTIFICATION_STATE,
	NOTIFY_USER_PAYLOAD,
	RAW_NOTIFICATION,
	UPDATE_NOTIFICATION_DATA,
	UPDATE_NOTIFICATION_PAYLOAD,
	UPDATE_STATUS_PAYLOAD,
	USER_NOTIFICATION,
} from '../shared/types/notifications.types.js';
import { millis } from 'nats';

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

	/**
	 * Creates a user notification and sends it through NATS if it's recent.
	 *
	 * @param payload The notification content and metadata. Should match the `NOTIFY_USER_PAYLOAD` type.
	 * @param timestamp The creation time of the notification, in nanoseconds.
	 *
	 * @returns A Promise that resolves once the notification is created (and possibly dispatched).
	 * @remarks
	 * 1. The notification is first registered in the system.
	 * 2. If the notification is less than 5 minutes old, it's published through NATS to `gateway`
	 * 3. Otherwise, it is only stored but not dispatched.
	 *
	 */
	async createAndDispatchNotification(
		payload: NOTIFY_USER_PAYLOAD,
		timestamp: number,
	): Promise<void> {
		const { receiverId } = payload;

		fastify.log.info('UPDATE ARRIVED');
		fastify.log.info(payload);

		const resData = await this.registerNotification(payload);
		fastify.log.info('✅ Notification created');

		fastify.log.info(resData);

		const data = await this.filterMessage(resData);

		fastify.log.info(data);

		// ********************************* */
		// ** PAYLOAD TO SEND THROUGH `NATS`
		// ********************************* */
		const storedAt = millis(timestamp);
		const currentTime = Date.now();

		const fiveMinutes = 5 * 60 * 1000; // * 5 Minutes

		if (currentTime - storedAt > fiveMinutes) return;

		const resPayload = { userId: receiverId, data };

		const res = fastify.jc.encode(resPayload);
		fastify.nats.publish('gateway.notification.notify', res);
	}

	/**
	 * Updates a user notification and sends it through NATS.
	 *
	 * @param payload The notification content and metadata. Should match the `UPDATE_NOTIFICATION_PAYLOAD` type.
	 *
	 * @returns A Promise that resolves once the notification is created and dispatched.
	 * @remarks
	 * 1. The notification is first updated in the system.
	 * 2. Dispatch the notification through NATS to `gateway`
	 *
	 */
	async updateAndDispatchNotification(
		payload: UPDATE_NOTIFICATION_PAYLOAD,
	): Promise<void> {
		const { userId } = payload;
		const { notificationId, scope, status, state } = payload.data;

		fastify.log.info(payload.data);
		
		await this.updateNotification(userId, payload.data);
		fastify.log.info('✅ Notification updated ' + status);
		
		// ********************************* */
		// ** PAYLOAD TO SEND THROUGH `NATS`
		// ********************************* */
		const resPayload: UPDATE_NOTIFICATION_PAYLOAD = {
			userId,
			data: { notificationId, scope, status, state: state ?? 'pending' },
		};
		
		fastify.log.info("AFTER UPDATE");
		fastify.log.info(resPayload);

		const res = fastify.jc.encode(resPayload);
		fastify.nats.publish('gateway.notification.update', res);
	}

	async updateNotification(userId: number, payload: UPDATE_NOTIFICATION_DATA) {
		const { notificationId, scope, status, state } = payload;

		if (scope === 'all') {
			await this.notifRepository.updateAllNotif(status, userId);
		} else {
			await this.notifRepository.updateNotif(
				status,
				state ?? 'pending',
				userId,
				notificationId,
			);
		}
	}

	/**
	 * Updates a user notification status.
	 *
	 * @param payload The notification content and metadata. Should match the `UPDATE_STATUS_PAYLOAD` type.
	 *
	 * @returns A Promise that resolves once the notification is created (and possibly dispatched).
	 * @remarks
	 * 1. The notification is first updated in the system.
	 * 2. Dispatch the notification through NATS to `gateway`
	 *
	 */
	async updateAndDispatchStatus(payload: UPDATE_STATUS_PAYLOAD): Promise<void> {
		const { senderId, receiverId, status, type } = payload;
		
		if (type === 'friend_request') {
			const { id } = await this.notifRepository.getNotifId(
				senderId,
				receiverId,
				type,
			);
			fastify.log.info(id);
			
			if (status === 'dismissed')
				await this.notifRepository.removeNotif(id);
			
			// ********************************* */
			// ** PAYLOAD TO SEND THROUGH `NATS`
			// ********************************* */
			const resPayload: UPDATE_NOTIFICATION_PAYLOAD = {
				userId: receiverId,
				data: { notificationId: id, scope: 'single', status, state: 'finished' },
			};
			fastify.log.info(resPayload);

			const res = fastify.jc.encode(resPayload);
			fastify.nats.publish('gateway.notification.update', res);
		} else if (type === 'game') {
			const { actionUrl } = payload;
			const { id } = await this.notifRepository.getNotifIdByActionURL(
				actionUrl || 'nothing',
			);

			await this.notifRepository.updateNotifStatus(id, 'finished');

			// ********************************* */
			// ** PAYLOAD TO SEND THROUGH `NATS`
			// ********************************* */
			const resPayload: UPDATE_NOTIFICATION_PAYLOAD = {
				userId: receiverId,
				data: {
					notificationId: id,
					scope: 'single',
					status,
					state: 'finished',
				},
			};

			const res = fastify.jc.encode(resPayload);
			fastify.nats.publish('gateway.notification.update', res);
		} else if (type === 'tournament') {
			/**
			 * TODO - adapt with smoumni
			 */
		}
	}

	async unpackMessages(
		fullData: RAW_NOTIFICATION[],
	): Promise<USER_NOTIFICATION[]> {
		return Promise.all(fullData.map(this.filterMessage));
	}

	private async filterMessage(data: RAW_NOTIFICATION): Promise<USER_NOTIFICATION> {
		const res = await fastify.nats.request(
			'user.avatar',
			fastify.jc.encode({ user_id: data.sender_id }),
		);

		const res_dec = fastify.jc.decode(res.data);

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
			state: data.state,
			actionUrl: data.action_url,
			avatar: res_dec.avatar_path,
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
			senderUsername.username,
		);

		return data;
	}
}

export default NotifSerives;
