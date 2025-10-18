import type NotifSerives from '@/services/notif.services.ts';
import 'fastify';
import { NatsConnection, JSONCodec } from 'nats';
import { Database } from 'sqlite3';

declare module 'fastify' {
	interface FastifyInstance {
		notifService: NotifSerives;
		database: Database;
		nats: NatsConnection;
		jc: JSONCodec;
		gameUsers: Map<string, NodeJS.Timeout>;
	}
}
