import 'fastify';
import { NatsConnection } from 'nats';

declare module 'fastify' {
	interface FastifyInstance {
		nats: NatsConnection;
	}
}

export interface dataType {
	username: string;
	type: 'notify' | 'update';
	data: any;
}

export interface NatsPluginOpts {
	NATS_USER: string;
	NATS_PASSWORD: string;
}
