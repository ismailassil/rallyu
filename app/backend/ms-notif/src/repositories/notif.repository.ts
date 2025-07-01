import { notifType } from '../shared/types/notifyBody.types.js';
import fastify from '../app.js';

class NotifRepository {
	async checkUser(username: string): Promise<number | null> {
		return new Promise((resolve) => {
			fastify.database.get<{ id: number; username: string }>(
				'SELECT * FROM notification_users WHERE username = ?',
				username,
				(error, row) => {
					if (error) {
						fastify.log.error('DB Error: ' + error.message);
						resolve(null);
						return;
					}
					if (!row) {
						fastify.log.warn(`${username} not found in DB`);
						resolve(null);
					}
					fastify.log.info(`${username} already registered`);
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
						fastify.log.error('DB Error: ' + error.message);
						reject(error);
						return;
					}
					fastify.log.info('Row inserted with ID: ' + this.lastID);
					resolve(this.lastID);
				},
			);
		});
	}

	registerMessage(
		from_id: number,
		to_id: number,
		type: notifType,
		msg: string | undefined,
		action_url: string | undefined,
	) {
		fastify.database.run(
			`INSERT INTO messages(from_user_id, to_user_id, type, msg, action_url) VALUES(?, ?, ?, ?, ?)`,
			[from_id, to_id, type, msg, action_url],
			(error) => {
				if (error) {
					fastify.log.error('DB Error: ', error);
				}
			},
		);
	}
}

export default NotifRepository;
