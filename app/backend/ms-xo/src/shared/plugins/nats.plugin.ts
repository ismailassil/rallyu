import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { NatsOpts } from '../types/nats.plugin.types';
import { connect } from 'nats';

const natsPlugin = fastifyPlugin(
	async (fastify: FastifyInstance, natsOps: NatsOpts) => {
		try {
			const nc = await connect({
				servers: `nats://localhost:${natsOps.NATS_PORT}`,
				user: natsOps.NATS_USER,
				pass: natsOps.NATS_PASSWORD,
			});

			fastify.log.info('[NATS] Connection Established');

			fastify.decorate('nc', nc);
		} catch (error) {
			fastify.log.error('[NATS] ' + (error as Error).message);
		}
	},
);

export default natsPlugin;
