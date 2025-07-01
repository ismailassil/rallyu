import 'fastify';
import { Database } from 'sqlite3';

declare module 'fastify' {
	interface FastifyInstance {
		database: Database;
	}
}
