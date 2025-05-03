import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../../database/database.sqlite');

const databasePlugin = fp(async function (fastify: FastifyInstance) {
	const database = await open({
		filename: dbPath,
		driver: sqlite3.Database,
	});

	// Ensure the table exists
	const createTables = `
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			firstName TEXT NOT NULL,
			lastName TEXT NOT NULL,
			username TEXT NOT NULL UNIQUE,
			email TEXT NOT NULL UNIQUE,
			password VARCHAR(255) NOT NULL,
			role TEXT NOT NULL DEFAULT 'user'
		);
		CREATE TABLE IF NOT EXISTS refresh_tokens (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			token VARCHAR(255) NOT NULL,
			device_info TEXT,
			FOREIGN KEY (user_id) REFERENCES users(id)
		);
	`;
	await database.exec(createTables);

	fastify.decorate('database', database);

	// Close Connection When the Server STOPS
	fastify.addHook('onClose', async function (instance) {
		if (instance.database) {
			await instance.database.close();
		}
	});
});

export default databasePlugin;
