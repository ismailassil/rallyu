import fastify from './app.js';
import 'dotenv/config';
import fastifySchedule from '@fastify/schedule';
import NotifRoutes from './routes/notif.routes.js';
import schemasPlugin from './shared/plugins/schema.plugin.js';
import databasePlugin from './shared/plugins/database.plugin.js';
import { natsPlugin } from './shared/plugins/nats.plugin.js';
import fastifyPrintRoutes from 'fastify-print-routes';

const PORT = parseInt(process.env.PORT || '');
const routesPrefix = { prefix: '/notif' };

// fastify.register(fastifyPrintRoutes);
fastify.register(schemasPlugin);
fastify.register(databasePlugin);
fastify.register(NotifRoutes, routesPrefix);
fastify.register(fastifySchedule);
// fastify.register(CronJobPlugin); // TODO: Activate this in Production
fastify.register(natsPlugin, {
	NATS_URL: process.env.NATS_URL ?? undefined,
	NATS_PORT: process.env.NATS_PORT ?? '',
	NATS_USER: process.env.NATS_USER ?? '',
	NATS_PASSWORD: process.env.NATS_PASSWORD ?? '',
});

(async () => {
	try {
		await fastify.ready();
		fastify.listen({ host: "::", port: 5000 }, (err) => {
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
