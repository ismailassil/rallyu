import fastify from "@/app.js";
import { NotificationNotFoundException } from "@/shared/exceptions/NotificationNotFoundException.js";
import type {
	NOTIFICATION_STATE,
	NOTIFICATION_STATUS,
	NOTIFICATION_TYPE,
	NOTIFY_USER_PAYLOAD,
	RAW_NOTIFICATION,
} from "../shared/types/notifications.types.js";

class NotifRepository {
	async registerMessage(
		payload: NOTIFY_USER_PAYLOAD,
		senderUsername: string,
	): Promise<RAW_NOTIFICATION> {
		const { senderId, receiverId, type, message, actionUrl } = payload;

		try {
			const stmt = fastify.database.prepare(`
				INSERT INTO messages (sender_id, sender_username, receiver_id, type, content, action_url)
				VALUES (?, ?, ?, ?, ?, ?)
			`);

			const info = stmt.run(senderId, senderUsername, receiverId, type, message, actionUrl);

			const row = fastify.database
				.prepare(`SELECT * FROM messages WHERE id = ?`)
				.get(info.lastInsertRowid);

			fastify.log.info(`✅ msg registration done`);
			return row;
		} catch (error) {
			fastify.log.error("3- DB Error: " + error);
			throw error;
		}
	}

	async getMessages(receiver_id: number, page: number): Promise<RAW_NOTIFICATION[]> {
		fastify.log.info(`receiver_id: ${receiver_id} + page: ${page}`);

		const LIMIT = 10;
		const offset = (page - 1) * LIMIT;

		try {
			const stmt = fastify.database.prepare(`
				SELECT * FROM messages 
				WHERE receiver_id = ? AND status != 'dismissed' 
				ORDER BY created_at DESC 
				LIMIT ? OFFSET ?
			`);

			const rows = stmt.all(receiver_id, LIMIT, offset);

			if (!rows || rows.length === 0) {
				return [];
			}

			fastify.log.info("✅ Msgs found");
			return rows;
		} catch (error) {
			fastify.log.error("4- DB Error: " + error);
			throw error;
		}
	}

	async updateNotif(
		notificationId: number,
		receiver_id: number,
		status: NOTIFICATION_STATUS,
		state: NOTIFICATION_STATE,
	): Promise<RAW_NOTIFICATION> {
		try {
			const stmt = fastify.database.prepare(`
				UPDATE messages SET status = ?,
					state = CASE
						WHEN state = 'pending' THEN ?
						ELSE state
					END
				WHERE id = ? AND receiver_id = ?
			`);

			const info = stmt.run(status, state, notificationId, receiver_id);

			if (info.changes === 0) {
				throw new NotificationNotFoundException();
			}

			// Return the updated row
			const row = fastify.database
				.prepare(`SELECT * FROM messages WHERE id = ?`)
				.get(notificationId);

			return row;
		} catch (error) {
			fastify.log.error("5- DB Error: " + error);
			throw error;
		}
	}

	async updateAllNotif(receiver_id: number, status: NOTIFICATION_STATUS): Promise<void> {
		try {
			const stmt = fastify.database.prepare(`
				UPDATE messages SET status = ?
				WHERE receiver_id = ? AND NOT (status = 'dismissed' AND ? = 'unread')
			`);
			stmt.run(status, receiver_id, status);
		} catch (error) {
			fastify.log.error("6- DB Error: " + error);
			throw error;
		}
	}

	async updateAllNotifOnType(
		receiver_id: number,
		status: NOTIFICATION_STATUS,
		state: NOTIFICATION_STATE,
		type: NOTIFICATION_TYPE,
	) {
		try {
			const stmt = fastify.database.prepare(`
				UPDATE messages SET status = ?, state = CASE
						WHEN state = 'pending' THEN ?
						ELSE state
					END
				WHERE receiver_id = ? AND type = ?
			`);
			stmt.run(status, state, receiver_id, type);
		} catch (error) {
			fastify.log.error("6- DB Error: " + error);
			throw error;
		}
	}

	async updateAllStates(
		receiver_id: number,
		state: NOTIFICATION_STATE,
		status: NOTIFICATION_STATUS,
	) {
		try {
			const stmt = fastify.database.prepare(`
				UPDATE messages SET state = ?, status = ?
				WHERE receiver_id = ?
			`);
			stmt.run(receiver_id, state, status);
		} catch (error) {
			fastify.log.error("6- DB Error: " + error);
			throw error;
		}
	}

	async getNotifId(
		senderId: number,
		receiverId: number,
		type: NOTIFICATION_TYPE,
	): Promise<{ id: number }> {
		try {
			const stmt = fastify.database.prepare(`
				SELECT id FROM messages
				WHERE sender_id = ? AND receiver_id = ? AND type = ?
				ORDER BY created_at DESC
				LIMIT 1
			`);

			const row = stmt.get(senderId, receiverId, type);

			if (!row) {
				throw new Error("No message found");
			}

			return row;
		} catch (error) {
			fastify.log.error("DB ERROR: " + error);
			throw error;
		}
	}

	async getNotifById(id: number): Promise<RAW_NOTIFICATION> {
		try {
			const stmt = fastify.database.prepare(`
				SELECT * FROM messages
				WHERE id = ?
			`);

			const row = stmt.get([id]);

			if (!row) {
				throw new Error("No message found");
			}

			return row;
		} catch (error) {
			fastify.log.error("DB ERROR: " + error);
			throw error;
		}
	}

	async getNotifIdByActionURL(actionUrl: string): Promise<{ id: number }> {
		try {
			const stmt = fastify.database.prepare(`
				SELECT id FROM messages WHERE action_url = ?
			`);

			const row = stmt.get(actionUrl);

			if (!row) {
				throw new Error("No Message found");
			}

			return row;
		} catch (error) {
			fastify.log.error("DB ERROR: " + error);
			throw error;
		}
	}

	async removeNotif(notificationId: number): Promise<void> {
		try {
			const stmt = fastify.database.prepare(`
				DELETE FROM messages WHERE id = ?
			`);

			const info = stmt.run(notificationId);

			if (info.changes === 0) {
				throw new Error(`DB - ${notificationId} NOT DELETED`);
			}
		} catch (error) {
			fastify.log.error("DB ERROR: " + error);
			throw error;
		}
	}

	async updateNotifStatus(
		notifId: number,
		state: NOTIFICATION_STATE,
		status: NOTIFICATION_STATUS,
	): Promise<void> {
		try {
			const stmt = fastify.database.prepare(`
				UPDATE messages SET state = ?, status = ?
				WHERE id = ?
			`);

			const info = stmt.run(state, status, notifId);

			if (info.changes === 0) {
				throw new Error(`DB - ${notifId} NOT UPDATED`);
			}
		} catch (error) {
			fastify.log.error(error);
			throw error;
		}
	}
}

export default NotifRepository;
