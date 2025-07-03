import fastify from './app.js';
import 'dotenv/config';
import './shared/types/socketio.types.js';
import fastifySocketIO from 'fastify-socket.io';
import NotifRoutes from './routes/notif.routes.js';
import schemasPlugin from './shared/plugins/schemaPlugin.js';
import databasePlugin from './models/notif.model.js';
import fastifyRedis from '@fastify/redis';
import socketIOPlugin from './shared/plugins/socketIOPlugin.js';
import fastifySchedule from '@fastify/schedule';

const PORT = parseInt(process.env.PORT || '9012');

const redisOptions = {
	host: '127.0.0.1',
	password: process.env.REDIS_PASSWORD,
	port: 6379,
};

const routesPrefix = { prefix: '/notif' };

await fastify.register(schemasPlugin);
await fastify.register(fastifySocketIO);
await fastify.register(fastifyRedis, redisOptions);
await fastify.register(databasePlugin);
await fastify.register(NotifRoutes, routesPrefix);
await fastify.register(socketIOPlugin);
await fastify.register(fastifySchedule);
// await fastify.register(CronJobPlugin);

function main() {
	fastify.listen({ host: '::', port: PORT }, (err) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
	});
}

main();
