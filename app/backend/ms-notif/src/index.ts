import fastify from './app.js';
import 'dotenv/config';
import './shared/types/socketio.types.js';
import NotifRoutes from './routes/notif.routes.js';
import schemasPlugin from './shared/plugins/schemaPlugin.js';
import databasePlugin from './models/notif.model.js';
import fastifyRedis from '@fastify/redis';
import fastifySchedule from '@fastify/schedule';
import { natsPlugin } from './shared/plugins/natsPlugin.js';
import fastifyPrintRoutes from 'fastify-print-routes';

const PORT = parseInt(process.env.PORT || '');

const redisOptions = {
	host: '127.0.0.1', // TODO: Change host into the redis container name
	// host: 'redis',
	password: process.env.REDIS_PASSWORD,
	port: 6379,
};

const routesPrefix = { prefix: '/notif' };

fastify.register(fastifyPrintRoutes);
fastify.register(schemasPlugin);
fastify.register(databasePlugin);
fastify.register(fastifyRedis, redisOptions);
fastify.register(NotifRoutes, routesPrefix);
fastify.register(fastifySchedule);
// fastify.register(CronJobPlugin); // TODO: Activate this in Production
fastify.register(natsPlugin, {
	NATS_PORT: process.env.NATS_PORT ?? '',
	NATS_USER: process.env.NATS_USER ?? '',
	NATS_PASSWORD: process.env.NATS_PASSWORD ?? '',
});

(async () => {
	try {
		await fastify.ready();
		fastify.listen({ host: '::', port: PORT }, (err) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}
		});
	} catch (error) {
		fastify.log.error((error as Error).message);
	}
})();

process.on('SIGINT', async () => {
	fastify.log.info('[ ~ ] CLOSING FASTIFY');
	await fastify.close();
	fastify.log.info('[ + ] FASTIFY Closed Successfully');

	process.exit(1);
});
