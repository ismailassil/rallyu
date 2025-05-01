import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fp from 'fastify-plugin';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../../database/database.sqlite');
const databasePlugin = fp(async function (fastify) {
    const database = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });
    // Ensure the table exists
    await database.exec(`
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				firstName TEXT NOT NULL,
				lastName TEXT NOT NULL,
				username TEXT NOT NULL UNIQUE,
				email TEXT NOT NULL UNIQUE,
				password TEXT NOT NULL,
				role TEXT NOT NULL DEFAULT 'user'
			);
		`);
    fastify.decorate('database', database);
    // Close Connection When the Server STOPS
    fastify.addHook('onClose', async function (instance) {
        if (instance.database) {
            await instance.database.close();
        }
    });
});
export default databasePlugin;
