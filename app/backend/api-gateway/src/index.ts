import { app as fastify } from './app.js';
import dotenv from '@dotenvx/dotenvx';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyMetrics from 'fastify-metrics';
import { FastifyReply, FastifyRequest } from 'fastify';
import { metricsAuthEndpoint } from './middleware/metrics.endpoint.js';
import { natsPlugin } from './plugin/nats/nats.plugin.js';
import { socketioPlugin } from './plugin/socketio/socketio.plugin.js';
import fastifyJwt from '@fastify/jwt';
import proxiesPlugin from './plugin/proxies/proxies.plugin.js';
import fastifyPrintRoutes from 'fastify-print-routes';

dotenv.config();

const SERVER_PORT = parseInt(process.env.PORT || '4004');
const FRONT_PORT = process.env.FRONT_PORT ?? '';

await fastify.register(fastifyPrintRoutes);

// ** CORS Plugin
await fastify.register(cors, {
	// TODO: Should be specified to the frontend
	// origin: [`http://frontend:${FRONT_PORT}`],
	origin: [`http://localhost:${FRONT_PORT}`],
	allowedHeaders: ['Content-Type', 'Authorization'],
	methods: ['GET', 'PUT', 'POST', 'DELETE'],
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

// ** SocketIO Plugin
const socketioOptions = { FRONT_PORT: FRONT_PORT };

// TODO: Add Authentication to Sockets
await fastify.register(socketioPlugin, socketioOptions);

// ** NATS Plugin
const natsOptions = {
	NATS_USER: process.env.NATS_USER ?? '',
	NATS_PASSWORD: process.env.NATS_PASSWORD ?? '',
};

await fastify.register(natsPlugin, natsOptions);

// ** PROXY Plugin
await fastify.register(proxiesPlugin, {
	NOTIF_PORT: process.env.NOTIF_PORT ?? '',
	AUTH_PORT: process.env.AUTH_PORT ?? '',
	CHAT_PORT: process.env.CHAT_PORT ?? '',
});

// ** METRICS Plugin
fastify.register(fastifyMetrics, { endpoint: '/inter-metrics' });

// ** Metrics Endpoint Authorization
fastify.addHook('preHandler', metricsAuthEndpoint);

fastify.get('/health', { exposeHeadRoute: false }, async (_, res: FastifyReply) => {
	return res.status(200).send({ status: 'up' });
});

(function () {
	fastify.listen({ host: '::', port: SERVER_PORT }, (error) => {
		if (error) {
			fastify.log.error(error);
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
