import fastify, { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Codec, connect, JSONCodec, NatsConnection, StringCodec } from 'nats';
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
				name: 'Gateway',
			});

			fastify.log.info(
				`✅ Nats Server Connection Established ${nats.getServer()}`,
			);

			// ** JetStreams
			const natsManager = await nats.jetstreamManager();

			const streamName = 'chatStream';
			const subject = 'chat.*';
			await natsManager.streams
				.info(streamName)
				.then(() => {
					fastify.log.info(`✅ Stream: ${streamName} already Created`);
				})
				.catch(async (error) => {
					if (error) {
						fastify.log.error(error);
						await natsManager.streams.add({
							name: streamName,
							subjects: [subject],
							description:
								'Stream for chat Micro-service binded with Websockets',
						});
					}
				});

			// ** NATS Core
			nats.subscribe('notification', {
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

			// ** NATS Decorator
			fastify.decorate('nats', nats);

			fastify.addHook('onClose', async () => {
				await natsManager.streams.delete('chatStream');
				await nats.close();
				fastify.log.info('⚾️ NATS Closed Successfully');
			});
		} catch (err) {
			fastify.log.error(err);
			return;
		}
	},
	{ name: 'NATS Plugin' },
);
