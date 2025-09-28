import 'fastify';
import { NatsConnection, JSONCodec } from 'nats';
import { Database } from 'sqlite3';
import NotifSerives from '@/services/notif.services';

declare module 'fastify' {
	interface FastifyInstance {
		notifService: NotifSerives;
		database: Database;
		nats: NatsConnection;
		jc: JSONCodec;
	}
}
