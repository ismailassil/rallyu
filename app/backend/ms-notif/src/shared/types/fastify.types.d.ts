import 'fastify';
import { NatsConnection, JSONCodec } from 'nats';
import { Database } from 'sqlite3';

declare module 'fastify' {
	interface FastifyInstance {
		database: Database;
		nats: NatsConnection;
		jc: JSONCodec;
	}
}
