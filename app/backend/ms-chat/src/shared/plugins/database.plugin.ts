import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import Database from 'better-sqlite3';
import Path from 'node:path';

const db_filename = Path.join(__dirname, '../../../database/database.sqlite');

const databasePlugin = fastifyPlugin(
	async function (fastify: FastifyInstance) {
		const db = new Database(db_filename);

		db.exec(`
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				username TEXT UNIQUE NOT NULL,
				first_name TEXT NOT NULL,
				last_name TEXT NOT NULL,
				image BLOB NOT NULL
			);

			CREATE TABLE IF NOT EXISTS messages (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				sender_id INTEGER NOT NULL,
				receiver_id INTEGER NOT NULL,
				message TEXT NOT NULL,
				sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
				seen_at TIMESTAMP,
				status TEXT CHECK( status IN ('read', 'unread')) NOT NULL DEFAULT 'unread',

				FOREIGN KEY (sender_id) REFERENCES users(id),
				FOREIGN KEY (receiver_id) REFERENCES users(id)
			);
			
			CREATE INDEX IF NOT EXISTS idx_msg_pair ON messages(sender_id, receiver_id);
			CREATE INDEX IF NOT EXISTS idx_sent_at ON messages(sent_at);
		`);

		fastify.decorate('database', db);

		fastify.addHook('onClose', () => db.close());
	},
	{ name: 'Database (SQLite3) Plugin' },
);

export default databasePlugin;
