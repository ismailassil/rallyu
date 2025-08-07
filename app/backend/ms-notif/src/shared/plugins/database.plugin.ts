import sqlite3, { verbose } from 'sqlite3';
import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const databasePath = path.join(__dirname, '../../../database/database.sqlite');

const databasePlugin = fastifyPlugin(async (fastify: FastifyInstance) => {
	const sqlite = sqlite3.verbose();
	const db = new sqlite.Database(databasePath, (error) => {
		if (error) {
			fastify.log.error('[SQL] Error: ' + error.message);
			return;
		}
		fastify.log.info('[SQL] Opened Successfully');
	});

	const createTable = `
		CREATE TABLE IF NOT EXISTS messages (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			sender_id INTEGER NOT NULL,
			sender_username TEXT NOT NULL,
			receiver_id INTEGER NOT NULL,
			content TEXT,
			type TEXT CHECK(type IN ('game', 'chat', 'friend_request', 'tournament', 'status')),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			status TEXT CHECK(status IN ('read', 'unread', 'dismissed')) DEFAULT 'unread',
			state TEXT CHECK(state IN ('pending', 'finished')) DEFAULT 'pending',
			action_url TEXT
		);

		CREATE TRIGGER IF NOT EXISTS trg_messages_update_timestamp
		AFTER UPDATE OF status ON messages
		FOR EACH ROW
		BEGIN
			UPDATE messages SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
		END;

		CREATE INDEX IF NOT EXISTS idx_messages_receiver_status ON messages(receiver_id, status);
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
