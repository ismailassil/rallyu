import { Database } from 'better-sqlite3';
import 'fastify';

export module 'fastify' {
	interface FastifyInstance {
		database: Database;
		nc: NatsConnection;
	}
}
