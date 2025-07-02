import INotifyBody, { notifType } from '../shared/types/notifyBody.types.js';
import fastify from '../app.js';
import INotifMessage, { statusType } from '../shared/types/notifMessage.types.js';

class NotifRepository {
	async checkUser(username: string): Promise<number | null> {
		return new Promise((resolve, reject) => {
			fastify.database.get<{ id: number; username: string }>(
				'SELECT * FROM notification_users WHERE username = ?',
				username,
				(error, row) => {
					if (error) {
						fastify.log.error('1- DB Error: ' + error);
						reject(error);
						return;
					}
					if (!row) {
						fastify.log.warn(`${username} not found in DB`);
						resolve(null);
						return;
					}
					fastify.log.info(
						`✅ ${username} already registered with ID: ${row.id}`,
					);
					resolve(row.id);
				},
			);
		});
	}

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
		from_id: number,
		to_id: number,
		body: INotifyBody,
	): Promise<number> {
		const { from_user, to_user, msg, type, action_url } = body;

		return new Promise((resolve, reject) => {
			fastify.database.get<INotifMessage>(
				`INSERT INTO messages(from_user_id, from_user, to_user_id, to_user, type, message, action_url) VALUES(?, ?, ?, ?, ?, ?, ?) RETURNING *`,
				[from_id, from_user, to_id, to_user, type, msg, action_url],
				async function (error, row) {
					if (error) {
						fastify.log.error('3- DB Error: ' + error);
						reject(error);
						return;
					}
					fastify.log.info(`✅ msg registration done`);
					await fastify.redis.set(
						`notif?id=${row.id}`,
						JSON.stringify(row),
					);
					resolve(row.id);
				},
			);
		});
	}

	getMessages(
		user_id: number,
		limit: number,
		offset: number,
	): Promise<INotifMessage[]> {
		fastify.log.info(
			`user_id: ${user_id} + limit: ${limit} + offset: ${offset}`,
		);
		return new Promise((resolve, reject) => {
			fastify.database.all<INotifMessage>(
				"SELECT * FROM messages WHERE to_user_id = ? AND type != 'dismissed' ORDER BY created_at ASC LIMIT ? OFFSET ?",
				[user_id, limit, offset],
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
		status: statusType,
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
						reject('No changes affected');
					}
				},
			);
		});
	}

	updateAllNotif(status: statusType, user_id: number): Promise<void> {
		return new Promise((_, reject) => {
			fastify.database.all(
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
