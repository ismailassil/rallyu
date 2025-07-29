import fastify from '../app.js';
import { NotificationNotFoundException } from '../shared/exceptions/NotificationNotFoundException.js';
import NotificationPayload, {
	NotificationDetail,
	StatusType,
} from '../shared/types/notifications.types.js';

class NotifRepository {
	registerUser(username: string): Promise<number> {
		return new Promise((resolve, reject) => {
			fastify.database.run(
				`INSERT INTO notification_users(username) VALUES(?)`,
				username,
				function (error) {
					if (error) {
						fastify.log.error('2- DB Error: ' + error);
						reject(error);
						return;
					}
					fastify.log.info(
						`✅ ${username} inserted with ID: ${this.lastID}`,
					);
					resolve(this.lastID);
				},
			);
		});
	}

	async registerMessage(
		payload: NotificationPayload,
		senderUsername: string,
		recipientUsername: string,
	): Promise<NotificationDetail> {
		const { senderId, recipientId, type, message, actionUrl } = payload;

		return new Promise((resolve, reject) => {
			fastify.database.get<NotificationDetail>(
				`INSERT INTO messages
					(sender_id, sender_username, recipient_id, recipient_username, type, content, action_url) 
					VALUES(?, ?, ?, ?, ?, ?, ?) RETURNING *`,
				[
					senderId,
					senderUsername,
					recipientId,
					recipientUsername,
					type,
					message,
					actionUrl,
				],
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

	getMessages(user_id: number, page: number): Promise<NotificationDetail[]> {
		fastify.log.info(`user_id: ${user_id} + page: ${page}`);

		const LIMIT = 10;

		const offset = (page - 1) * LIMIT;
		return new Promise((resolve, reject) => {
			fastify.database.all<NotificationDetail>(
				`SELECT * FROM messages 
					WHERE recipient_id = ? AND type != 'dismissed' 
					ORDER BY updated_at 
					DESC LIMIT ? OFFSET ?`,
				[user_id, LIMIT, offset],
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
		status: StatusType,
		to_user_id: number,
		notificationId: number,
	): Promise<boolean> {
		return new Promise((resolve, reject) => {
			fastify.database.run(
				'UPDATE messages SET status = ? WHERE id = ? AND to_user_id = ?',
				[status, notificationId, to_user_id],
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

	updateAllNotif(status: StatusType, user_id: number): Promise<void> {
		return new Promise((_, reject) => {
			fastify.database.run(
				'UPDATE messages SET status = ? WHERE to_user_id = ?',
				[status, user_id],
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
