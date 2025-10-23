import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const ___filename = fileURLToPath(import.meta.url);
const ___dirname = dirname(___filename);
const __filePath = path.join(___dirname, "../../database/database.sqlite");

async function dbConnector(fastify, options) {
	const db = new Database(__filePath, { verbose: console.log });

	db.exec(`
		CREATE TABLE IF NOT EXISTS message (
			senderId INTEGER NOT NULL,
			receiverId INTEGER NOT NULL,
			text TEXT NOT NULL,
			created_at DATETIME DEFAULT (datetime('now', 'subsec'))
		)
	`);
	fastify.decorate('db', db);

	fastify.addHook('onClose', (fastify, done) => {
		db.close();
		done();
	});

	fastify.log.info('Database and posts table created successfully');
}

export default fp(dbConnector);
