import 'fastify';
import type { Codec, JetStreamClient, NatsConnection } from 'nats';

declare module 'fastify' {
	interface FastifyInstance {
		nc: NatsConnection;
		js: JetStreamClient;
		chatSubject: string;
		jsCodec: Codec<unknown>;
		scCodec: Codec<String>;
	}
}

export interface NatsPluginOpts {
	NATS_URL: string | undefined;
	NATS_USER: string;
	NATS_PASSWORD: string;
}
