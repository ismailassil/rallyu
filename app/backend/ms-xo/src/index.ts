import fastify from './app';
import dotenv from '@dotenvx/dotenvx';
import databasePlugin from './shared/plugins/database.plugin';
import natsPlugin from './shared/plugins/nats.plugin';
import socketPlugin from './shared/plugins/socketio.plugin';

dotenv.config();

const SERVER_PORT = parseInt(process.env.PORT || '');
const NATS_PORT = process.env.NATS_PORT || '';
const NATS_USER = process.env.NATS_USER || '';
const NATS_PASSWORD = process.env.NATS_PASSWORD || '';

const natsOpts = {
	NATS_PORT,
	NATS_USER,
	NATS_PASSWORD,
};

fastify.register(databasePlugin);
fastify.register(natsPlugin, natsOpts);
fastify.register(socketPlugin);

(async () => {
	try {
		await fastify.ready();
		await fastify.listen({ host: '::', port: 3457 });
	} catch (err) {
		fastify.log.error((err as Error).message);
	}
})();
