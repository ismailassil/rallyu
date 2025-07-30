import fastifyPlugin from 'fastify-plugin';
import { connect, JSONCodec } from 'nats';

async function natsPlugin(fastify, options) {
	const { NATS_URL, NATS_USER, NATS_PASSWORD } = options;
	const jcodec = JSONCodec();
	const scoded = JSONCodec();

	try {
		const nc = await connect({
			servers: NATS_URL,
			user: NATS_USER,
			pass: NATS_PASSWORD,
			name: "Chat",
		});

		// ** This is a JetStream Client
		const js = nc.jetstream();

		const streamName = 'chatStream';
		const consumerName = 'chatConsumer';

		// ** Get the Consumer from the NATS Server
		const consumer = await js.consumers.get(streamName, consumerName);
		fastify.log.info('[NATS] Consumer found');

		(async () => {
			const iter = await consumer.consume();

			for await (const m of iter) {
				fastify.log.info(m.subject);



				// ! This is NECESSARY to confirm that the message has arrived
				m.ack();
			}
		})();

		fastify.decorate('nc', nc);
	} catch (error) {
		fastify.log.error('[NATS] ' + error.message);
	}
}

export default fastifyPlugin(natsPlugin);
