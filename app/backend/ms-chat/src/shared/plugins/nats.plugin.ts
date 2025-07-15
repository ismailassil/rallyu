import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { connect, NatsConnection } from 'nats';
import { NatsOptions } from '../types/nats.types';

const natsPlugin = fastifyPlugin(
	async function (fastify: FastifyInstance, opts: NatsOptions) {
		const { NATS_PORT, NATS_USER, NATS_PASSWORD } = opts;

		const server: NatsConnection = await connect({
			servers: `nats://localhost:${NATS_PORT}`,
			user: NATS_USER,
			pass: NATS_PASSWORD,
			name: "Chat"
		});
		fastify.log.info('Nats is Running');
		
		fastify.decorate('nc', server);
		
		const js = server.jetstream();
		fastify.log.info('Connected to NATS with JetStream');

		fastify.addHook('onClose', async () => {
			fastify.log.info('[ ~ ] Closing NATS');
			await server.close();
			fastify.log.info('[ + ] NATS Closed Successfully');
		});
	},
	{ name: 'NATS Plugin' },
);

export default natsPlugin;
