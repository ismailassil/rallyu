import fp from 'fastify-plugin';
import Database from 'better-sqlite3';

async function dbConnector(fastify, options) {
	const dbFile = './database.sqlite';
	const db = new Database(dbFile, { verbose: console.log });

	db.exec(`
	CREATE TABLE IF NOT EXISTS message (
			senderId INTEGER NOT NULL,
			receiverId INTEGER NOT NULL,
			text TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
