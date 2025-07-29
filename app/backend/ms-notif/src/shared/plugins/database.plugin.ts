import sqlite3 from 'sqlite3';
import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const databasePath = path.join(__dirname, '../../../database/database.sqlite');

const databasePlugin = fastifyPlugin(async (fastify: FastifyInstance) => {
	const db = new sqlite3.Database(databasePath, (error) => {
		if (error) {
			fastify.log.error('[SQL] Error: ' + error.message);
			return;
		}
		fastify.log.info('[SQL] Opened Successfully');
	});

	// TODO: Add Image Column
	const createTable = `
		CREATE TABLE IF NOT EXISTS notification_users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT UNIQUE NOT NULL
		);

		CREATE TABLE IF NOT EXISTS messages (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			from_user_id INTEGER NOT NULL,
			from_user TEXT NOT NULL,
			to_user_id INTEGER NOT NULL,
			to_user TEXT NOT NULL,
			message TEXT NOT NULL,
			type TEXT CHECK(type IN ('game', 'chat', 'friend_request')),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			status TEXT CHECK(status IN ('read', 'unread', 'dismissed')) DEFAULT 'unread',
			action_url TEXT,
			FOREIGN KEY (from_user_id) REFERENCES notification_users(id),
			FOREIGN KEY (to_user_id) REFERENCES notification_users(id)
		);

		CREATE TRIGGER IF NOT EXISTS UpdateMessagesTimestamp
		AFTER UPDATE OF status ON messages
		FOR EACH ROW
		BEGIN
			UPDATE messages SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
		END;

		CREATE INDEX IF NOT EXISTS idx_messages_to_user_status ON messages(to_user_id, status);
	`;

	db.exec(createTable, (err) => {
		if (err) fastify.log.error(err.message);
		else fastify.log.info('[SQL] Tables Created Successfully');
	});

	fastify.decorate('database', db);

	fastify.addHook('onClose', async (instance) => {
		if (instance.database) {
			instance.database.close((err) => {
				if (err) {
					instance.log.error('[SQL] Error Closing ' + err?.message);
					return;
				}
				fastify.log.info('[SQL] Closed Successfully');
			});
		}
	});
});

export default databasePlugin;
