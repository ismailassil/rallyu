import fastify from './app.js';
import 'dotenv/config';
import fastifySocketIO from 'fastify-socket.io';
import NotifRoutes from './routes/notif.routes.js';
import schemasPlugin from './shared/plugins/schemaPlugin.js';
import './shared/types/socketio.types.js';
import databasePlugin from './models/notif.model.js';

const PORT = parseInt(process.env.PORT || '9012');

await fastify.register(schemasPlugin);
await fastify.register(fastifySocketIO);
await fastify.register(databasePlugin);
await fastify.register(NotifRoutes, { prefix: '/notif' });

const namespace = fastify.io.of('/notif');

namespace.on('connection', (socket) => {
	console.log('a User Connected', socket.id);
});

function main() {
	fastify.listen({ host: '::', port: PORT }, (err) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
	});
}

main();
