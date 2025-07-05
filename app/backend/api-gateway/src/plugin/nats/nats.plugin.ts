import fastify, { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Codec, connect, JSONCodec, NatsConnection } from 'nats';
import { dataType, NatsPluginOpts } from './nats.types';

export const natsPlugin = fp(
	async (fastify: FastifyInstance, opts: NatsPluginOpts) => {
		const { NATS_USER, NATS_PASSWORD } = opts;
		const jc: Codec<dataType> = JSONCodec();

		try {
			const nats: NatsConnection = await connect({
				servers: 'nats://localhost:4222',
				user: NATS_USER,
				pass: NATS_PASSWORD,
			});

			fastify.log.info('✅ Nats Server Connection Established');

			fastify.decorate('nats', nats);

			fastify.nats.subscribe('notification', {
				async callback(err, msg) {
					if (err) {
						fastify.log.error(err);
						return;
					}
					fastify.log.info('👍 Message Arrived to `notification`');

					const payload: dataType = jc.decode(msg.data);

					fastify.log.info(payload);

					fastify.io.in(payload.username).emit(payload.type, payload.data);
				},
			});

			fastify.addHook('onClose', async () => {
				await nats.close();
			});
		} catch (err) {
			fastify.log.error(err);
			return;
		}
	},
	{
		name: 'NATS Plugin',
	},
);
