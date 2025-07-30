import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { NatsPluginOpts } from './nats.types';
import NatsService from '../../services/NatsService.js';

export const natsPlugin = fp(
	async (fastify: FastifyInstance, opts: NatsPluginOpts) => {
		try {
			const ncService = new NatsService(fastify, opts);
			await ncService.connect();

			ncService.setupDecorators();

			fastify.addHook('onClose', async () => {
				await ncService.close();
			});
		} catch (err) {
			fastify.log.error((err as Error).message);
			return;
		}
	},
	{ name: 'NATS Plugin' },
);
