import { app as fastify } from './app.js';
import dotenv from 'dotenv';
import proxy from '@fastify/http-proxy';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyMetrics from 'fastify-metrics';
import { timingSafeEqual } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';

dotenv.config();

const PORT = parseInt(process.env.PORT || '4004');
const FRONT_PORT = process.env.FRONT_PORT;
const AUTH_PORT = process.env.AUTH_PORT;

// ** CORS Plugin
await fastify.register(cors, {
	// TODO: Should be specified to the frontend
	origin: [`http://frontend:${FRONT_PORT}`],
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

// ** PROXY Plugin
const authProxyOptions = {
	upstream: `http://localhost:${AUTH_PORT}`,
	prefix: '/api/auth',
	rewritePrefix: '/auth',
	httpMethods: ['GET', 'POST', 'DELETE', 'PUT'],
};

fastify.register(proxy, authProxyOptions);
fastify.register(fastifyMetrics, { endpoint: '/inter-metrics' });

// ** Metrics Endpoint Authorization (verification)
fastify.addHook('preHandler', async (req: FastifyRequest, rep: FastifyReply) => {
	if (req.url === '/inter-metrics') {
		const auth = req.headers['authorization'];
		const expected =
			'Basic ' +
			Buffer.from(
				`${process.env.METRIC_USER}:${process.env.METRIC_PASSWORD}`,
			).toString('base64');
		if (!auth)
			return rep
				.status(401)
				.header('www-authenticate', 'Basic')
				.send('Unauthorized');
		const authBuffer = Buffer.from(auth);
		const expectedBuffer = Buffer.from(expected);

		if (
			authBuffer.length !== expectedBuffer.length ||
			!timingSafeEqual(authBuffer, expectedBuffer)
		) {
			return rep
				.status(401)
				.header('www-authenticate', 'Basic')
				.send('Unauthorized');
		}
	}
});

fastify.get('/health', async (_, res: FastifyReply) => {
	return res.status(200).send({ status: 'up' });
});

async function main() {
	try {
		const address = await fastify.listen({ host: '::', port: PORT });
		fastify.log.info(`Server is running at ${address}`);
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
}

main();
