import Fastify from 'fastify';
import dbConnector from './plugin/database.plugin.js';
import natsPlugin from './plugin/nats.plugin.js';
import dotenv from '@dotenvx/dotenvx';

dotenv.config();

const fastify = Fastify({
	logger: {
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
			},
		},
	},
});

await fastify.register(dbConnector);
await fastify.register(natsPlugin, {
	NATS_URL: process.env.NATS_URL,
	NATS_USER: process.env.NATS_USER,
	NATS_PASSWORD: process.env.NATS_PASSWORD,
});

fastify.listen({ port: 4657, host: '::' }, (err) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});
