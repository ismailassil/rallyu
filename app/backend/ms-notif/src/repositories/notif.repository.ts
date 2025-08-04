import fastify from '../app.js';
import { NotificationNotFoundException } from '../shared/exceptions/NotificationNotFoundException.js';
import {
	NOTIFICATION_STATUS,
	NOTIFICATION_TYPE,
	NOTIFY_USER_PAYLOAD,
	RAW_NOTIFICATION,
} from '../shared/types/notifications.types.js';

class NotifRepository {
	async registerMessage(
		payload: NOTIFY_USER_PAYLOAD,
		senderUsername: string,
	): Promise<RAW_NOTIFICATION> {
		const { senderId, receiverId, type, message, actionUrl } = payload;

		return new Promise((resolve, reject) => {
			fastify.database.get<RAW_NOTIFICATION>(
				`INSERT INTO messages
					(sender_id, sender_username, receiver_id, type, content, action_url) 
					VALUES(?, ?, ?, ?, ?, ?, ?) RETURNING *`,
				[senderId, senderUsername, receiverId, type, message, actionUrl],
				async function (error, row) {
					if (error) {
						fastify.log.error('3- DB Error: ' + error);
						reject(error);
						return;
					}
					fastify.log.info(`✅ msg registration done`);
					resolve(row);
				},
			);
		});
	}

	getMessages(receiver_id: number, page: number): Promise<RAW_NOTIFICATION[]> {
		fastify.log.info(`receiver_id: ${receiver_id} + page: ${page}`);

		const LIMIT = 10;

		const offset = (page - 1) * LIMIT;
		return new Promise((resolve, reject) => {
			fastify.database.all<RAW_NOTIFICATION>(
				`SELECT * FROM messages 
					WHERE receiver_id = ? AND type != 'dismissed' 
					ORDER BY updated_at 
					DESC LIMIT ? OFFSET ?`,
				[receiver_id, LIMIT, offset],
				function (error, rows) {
					if (error) {
						fastify.log.error('4- DB Error: ' + error);
						reject(error);
						return;
					}
					if (!rows || rows.length === 0) {
						resolve([]);
					}
					fastify.log.info('✅ Msgs found');
					resolve(rows);
					return;
				},
			);
		});
	}

	updateNotif(
		status: NOTIFICATION_STATUS,
		receiver_id: number,
		notificationId: number,
	): Promise<boolean> {
		return new Promise((resolve, reject) => {
			fastify.database.run(
				'UPDATE messages SET status = ? WHERE id = ? AND receiver_id = ?',
				[status, notificationId, receiver_id],
				function (error) {
					if (error) {
						fastify.log.error('5- DB Error: ' + error);
						reject(error);
						return;
					}
					if (this.changes === 1) {
						resolve(true);
					} else {
						reject(new NotificationNotFoundException());
					}
				},
			);
		});
	}

	updateAllNotif(status: NOTIFICATION_STATUS, receiver_id: number): Promise<void> {
		return new Promise((_, reject) => {
			fastify.database.run(
				'UPDATE messages SET status = ? WHERE receiver_id = ?',
				[status, receiver_id],
				(error) => {
					if (error) {
						fastify.log.error('6- DB Error: ' + error);
						reject(error);
						return;
					}
					return;
				},
			);
		});
	}
}

export default NotifRepository;
