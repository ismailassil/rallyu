import fastify from './app';
import dotenv from '@dotenvx/dotenvx';
import databasePlugin from './shared/plugins/database.plugin';
import chatRoutes from './routes/chat.routes';

dotenv.config();

const PORT = parseInt(process.env.PORT || '7929');

// * Routes
fastify.register(chatRoutes, { prefix: '/chat/' });

// * DB Plugin
fastify.register(databasePlugin);

(function () {
	try {
		fastify.ready().then(
			() => {
				fastify.log.info('All Plugins Successfully booted!');
			},
			(err) => {
				fastify.log.error('an error happened ' + err);
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
