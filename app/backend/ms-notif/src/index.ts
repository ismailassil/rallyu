import fastify from './app.js';
import 'dotenv/config';
import fastifySchedule from '@fastify/schedule';
import NotifRoutes from './routes/notif.routes.js';
import schemasPlugin from './shared/plugins/schema.plugin.js';
import databasePlugin from './shared/plugins/database.plugin.js';
import { natsPlugin } from './shared/plugins/nats.plugin.js';
import fastifyPrintRoutes from 'fastify-print-routes';
import fastifyRedis from '@fastify/redis';

const PORT = parseInt(process.env.PORT || '');
const routesPrefix = { prefix: '/notif' };

fastify.decorate('gameUsers', new Map<string, NodeJS.Timeout>())
// fastify.register(fastifyPrintRoutes);
fastify.register(schemasPlugin);
fastify.register(databasePlugin);
fastify.register(NotifRoutes, routesPrefix);
fastify.register(fastifySchedule);
fastify.register(fastifyRedis, {
	url: "redis://redis",
	password: process.env.REDIS_PASSWORD ?? "",
	connectionName: "Notification Client",
	closeClient: true,
})

// fastify.register(CronJobPlugin); // TODO: Activate this in Production
fastify.register(natsPlugin, {
	NATS_URL: process.env.NATS_URL ?? undefined,
	NATS_USER: process.env.NATS_USER ?? '',
	NATS_PASSWORD: process.env.NATS_PASSWORD ?? '',
});

(async () => {
	try {
		await fastify.ready();
		fastify.listen({ host: "::", port: 5025 }, (err) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}
		});
	} catch (error) {
		fastify.log.error("[SERVER] " + (error as Error).message);
	}
})();

process.on('SIGINT', async () => {
	fastify.log.info('[ ~ ] CLOSING FASTIFY');
	await fastify.close();
	fastify.log.info('[ + ] FASTIFY Closed Successfully');

	process.exit(1);
});
