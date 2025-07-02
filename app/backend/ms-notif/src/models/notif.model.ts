import sqlite3 from 'sqlite3';
import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const databasePath = path.join(__dirname, '../../database/database.sqlite');

const databasePlugin = fastifyPlugin(async (fastify: FastifyInstance) => {
	const db = new sqlite3.Database(databasePath, (error) => {
		if (error) {
			fastify.log.error('Error: ' + error.message);
			return;
		}
		fastify.log.info('Database opened successfully');
	});

	// Add msg msg_count and unread_count - search for triggers to auto update
	const createTable = `
		CREATE TABLE IF NOT EXISTS notification_users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT UNIQUE NOT NULL,
			msg_count INTEGER NOT NULL
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
	`;

	db.exec(createTable, (err) => {
		if (err) fastify.log.error(err.message);
		else fastify.log.info('Tables created');
	});

	fastify.decorate('database', db);

	fastify.addHook('onClose', async (instance) => {
		if (instance.database) {
			instance.database.close((err) => {
				instance.log.error('Error closing DB ' + err?.message);
			});
		}
	});
});

export default databasePlugin;
