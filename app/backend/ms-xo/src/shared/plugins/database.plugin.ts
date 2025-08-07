import Database from 'better-sqlite3';
import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import path from 'node:path';

const filePath = path.join(__dirname, '../../../database/database.sqlite');

const databasePlugin = fastifyPlugin(async (fastify: FastifyInstance) => {
	try {
		const db = new Database(filePath);

		fastify.decorate('database', db);
	} catch (error) {
		fastify.log.error((error as Error).message);
	}
});

export default databasePlugin;
