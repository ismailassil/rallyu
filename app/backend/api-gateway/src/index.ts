import { app as fastify } from './app.js';
import dotenv from '@dotenvx/dotenvx';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyMetrics from 'fastify-metrics';
import { FastifyReply, FastifyRequest } from 'fastify';
import { metricsAuthEndpoint } from './endpoint/metrics.endpoint.js';
import { natsPlugin } from './plugin/nats/nats.plugin.js';
import { socketioPlugin } from './plugin/socketio/socketio.plugin.js';
import fastifyJwt from '@fastify/jwt';
import endpointsPlugin from './plugin/backendEnpoints/endpoints.plugin.js';

dotenv.config();

const PORT = parseInt(process.env.PORT || '4004');
const FRONT_PORT = process.env.FRONT_PORT;
const AUTH_PORT = process.env.AUTH_PORT;

// ** CORS Plugin
await fastify.register(cors, {
	// TODO: Should be specified to the frontend
	// origin: [`http://frontend:${FRONT_PORT}`],
	origin: [`http://localhost:${FRONT_PORT}`],
	allowedHeaders: ['Content-Type', 'Authorization'],
});

// ** RATE LIMIT Plugin
await fastify.register(fastifyRateLimit, {
	max: 200,
	timeWindow: '1 minute',
	allowList: (req, key) => {
		return req.hostname === 'backend-exporter';
	},
});

// ** HELMET Plugin
await fastify.register(helmet, {
	global: true,
});

// ** JWT Plugin
await fastify.register(fastifyJwt, {
	secret: process.env.JWT_KEY ?? '',
});

// ** NATS Plugin
const natsOptions = {
	NATS_USER: process.env.NATS_USER ?? '',
	NATS_PASSWORD: process.env.NATS_PASSWORD ?? '',
};

await fastify.register(natsPlugin, natsOptions);

// ** SocketIO Plugin

const socketioOptions = {
	FRONT_PORT: FRONT_PORT ?? '',
};

// TODO: Add Authentication to Sockets
await fastify.register(socketioPlugin, socketioOptions);

// ** PROXY Plugin
await fastify.register(endpointsPlugin, {
	NOTIF_PORT: process.env.NOTIF_PORT ?? '',
	AUTH_PORT: process.env.AUTH_PORT ?? '',
});

// ** METRICS Plugin
fastify.register(fastifyMetrics, { endpoint: '/inter-metrics' });

// ** Metrics Endpoint Authorization (verification)
fastify.addHook('preHandler', metricsAuthEndpoint);

fastify.get('/health', async (_, res: FastifyReply) => {
	return res.status(200).send({ status: 'up' });
});

async function main() {
	try {
		await fastify.listen({ host: '::', port: PORT });
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
}

main();

process.on('SIGINT', async () => {
	fastify.log.info('[ ~ ] CLOSING FASTIFY');
	await fastify.close();
	fastify.log.info('[ + ] FASTIFY Closed Successfully');

	process.exit(1);
});
