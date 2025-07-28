import 'fastify';
import { Codec, JetStreamClient, MsgHdrs, NatsConnection } from 'nats';

declare module 'fastify' {
	interface FastifyInstance {
		nats: NatsConnection;
		js: JetStreamClient;
		chatSubj: string;
		jsCodec: Codec<unknown>;
		scCodec: Codec<String>;
		headerReplyTo: MsgHdrs;
	}
}

export interface dataType {
	username: string;
	type: 'notify' | 'update';
	data: any;
}

export interface NatsPluginOpts {
	NATS_URL: string | undefined;
	NATS_USER: string;
	NATS_PASSWORD: string;
}
