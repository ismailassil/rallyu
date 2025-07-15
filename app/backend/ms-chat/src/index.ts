import fastify from './app';
import dotenv from '@dotenvx/dotenvx';
import databasePlugin from './shared/plugins/database.plugin';
import chatRoutes from './routes/chat.routes';
import fastifyPrintRoutes from 'fastify-print-routes';
import natsPlugin from './shared/plugins/nats.plugin';

dotenv.config();

const PORT = parseInt(process.env.PORT || '');
const NATS_PORT = process.env.NATS_PORT || '';
const NATS_USER = process.env.NATS_USER || '';
const NATS_PASSWORD = process.env.NATS_PASSWORD || '';

// * Routes
fastify.register(fastifyPrintRoutes);
fastify.register(chatRoutes, { prefix: '/chat/' });

// * DB Plugin
fastify.register(databasePlugin);

// * NATS Plugin
fastify.register(natsPlugin, {
	NATS_PORT,
	NATS_USER,
	NATS_PASSWORD,
});

(function () {
	try {
		fastify.ready().then(
			() => fastify.log.info('All Plugins Successfully booted!'),
			(err) => {
				if (err) fastify.log.error('an error happened ' + err);
			},
		);
		fastify.listen({ host: '::', port: PORT });
	} catch (err) {
		fastify.log.error(err);
	}
})();

process.on('SIGINT', async () => {
	fastify.log.info('[ ~ ] Closing Fastify');
	await fastify.close();
	fastify.log.info('[ + ] Fastify Closed Successfully');
});
