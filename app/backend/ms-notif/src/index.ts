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

const PORT = parseInt(process.env.PORT || '9012');

const redisOptions = {
	host: '127.0.0.1', // TODO: Change host into the redis container name
	// host: 'redis',
	password: process.env.REDIS_PASSWORD,
	port: 6379,
};

const routesPrefix = { prefix: '/notif' };

await fastify.register(fastifyPrintRoutes);
await fastify.register(schemasPlugin);
await fastify.register(fastifyRedis, redisOptions);
await fastify.register(databasePlugin);
await fastify.register(NotifRoutes, routesPrefix);
await fastify.register(fastifySchedule);
// await fastify.register(CronJobPlugin); // TODO: Activate this in Production
await fastify.register(natsPlugin);

(function () {
	fastify.listen({ host: '::', port: PORT }, (err) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
	});
})();

process.on('SIGINT', async () => {
	fastify.log.info('[ ~ ] CLOSING FASTIFY');
	await fastify.close();
	fastify.log.info('[ + ] FASTIFY Closed Successfully');

	process.exit(1);
});
