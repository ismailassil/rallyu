import fastify from '../app.js';
import { NotificationNotFoundException } from '../shared/exceptions/NotificationNotFoundException.js';
import {
	NOTIFICATION_STATE,
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
					VALUES(?, ?, ?, ?, ?, ?) RETURNING *`,
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
					WHERE receiver_id = ? AND status != 'dismissed' 
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
						return ;
					}
					fastify.log.info('✅ Msgs found');
					resolve(rows);
				},
			);
		});
	}

	updateNotif(
		status: NOTIFICATION_STATUS,
		state: NOTIFICATION_STATE,
		receiver_id: number,
		notificationId: number,
	): Promise<boolean> {
		return new Promise((resolve, reject) => {
			fastify.database.run(
				'UPDATE messages SET status = ?, state = ? WHERE id = ? AND receiver_id = ?',
				[status, state, notificationId, receiver_id],
				function (error) {
					if (error) {
						fastify.log.error('5- DB Error: ' + error);
						reject(error);
						return;
					}
					if (this.changes === 1) {
						resolve(true);
						return ;
					}
					reject(new NotificationNotFoundException());
					return ;
				},
			);
		});
	}

	updateAllNotif(status: NOTIFICATION_STATUS, receiver_id: number): Promise<void> {
		return new Promise((resolve, reject) => {
			fastify.database.run(
				'UPDATE messages SET status = ? WHERE receiver_id = ?',
				[status, receiver_id],
				(error) => {
					if (error) {
						fastify.log.error('6- DB Error: ' + error);
						reject(error);
						return;
					}
					resolve();
				},
			);
		});
	}
	
	getNotifId(
		senderId: number,
		receiverId: number,
		type: NOTIFICATION_TYPE,
	): Promise<{ id: number }> {
		return new Promise((resolve, reject) => {
			fastify.database.get<{ id: number }>(
				`
				SELECT id FROM messages
				WHERE sender_id = ? AND receiver_id = ?	AND type = ?
				ORDER BY updated_at DESC
				LIMIT 1;
				`,
				[senderId, receiverId, type],
				(err, row) => {
					if (err) {
						fastify.log.error('DB ERROR: ' + err);
						reject(err);
						return;
					}
					if (!row) {
						reject(new Error('No message found'));
						return;
					}
					resolve(row);
				},
			);
		});
	}

	async getNotifIdByActionURL(actionUrl: string): Promise<{ id: number }> {
		return new Promise((resolve, reject) => {
			fastify.database.get<{ id: number }>(
				`
				SELECT id FROM messages
				WHERE action_url = ?
				`,
				[actionUrl],
				(err, row) => {
					if (err) {
						fastify.log.error('DB ERROR: ' + err);
						reject(err);
						return;
					}
					if (!row) {
						reject(new Error('No Message found'));
						return;
					}
					resolve(row);
				},
			);
		});
	}

	removeNotif(notificationId: number): Promise<void> {
		return new Promise((resolve, reject) => {
			fastify.database.run(
				`DELETE FROM messages WHERE id = ?`,
				[notificationId],
				function (err) {
					if (err) {
						fastify.log.error('DB ERROR: ' + err);
						reject(err);
						return;
					}
					if (this.changes) {
						resolve();
						return;
					}
					reject(new Error(`DB - ${notificationId} NOT DELETED`));
				},
			);
		});
	}

	async updateNotifStatus(notifId: number, state: string): Promise<void> {
		return new Promise((resolve, reject) => {
			fastify.database.run(
				`
				UPDATE messages SET state = ?
				WHERE id = ?
				`,
				[state, notifId],
				function (err) {
					if (err) {
						fastify.log.error(err);
						reject(err);
						return;
					}
					if (this.changes) {
						resolve();
						return;
					}
					reject(new Error(`DB - ${notifId} NOT UPDATED`));
				},
			);
		});
	}
}

export default NotifRepository;
