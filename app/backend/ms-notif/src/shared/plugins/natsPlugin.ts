import fastify, { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { connect, NatsConnection, usernamePasswordAuthenticator } from 'nats';

const NATS_USER = process.env.NATS_USER;
const NATS_PASSWORD = process.env.NATS_PASSWORD;

export const natsPlugin = fp(async (fastify: FastifyInstance) => {
	try {
		const nats: NatsConnection = await connect({
			servers: 'nats://localhost:4222', // TODO: Change this to Nats container name
			user: NATS_USER,
			pass: NATS_PASSWORD,
		});

		fastify.log.info('✅ Nats Server Connection Established');

		fastify.decorate('nats', nats);

		fastify.addHook('onClose', async () => {
			try {
				await nats.close();
				fastify.log.info('⚾️ NATS Closed Successfully');
			} catch (error) {
				fastify.log.error(error);
			}
		});
	} catch (err) {
		fastify.log.error(err);
		return;
	}
});
