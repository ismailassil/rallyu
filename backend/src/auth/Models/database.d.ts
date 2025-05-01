import 'fastify';
import { Database as SQLiteDatabase } from 'sqlite';

declare module 'fastify' {
	interface FastifyInstance {
		database: SQLiteDatabase;
	}
}
