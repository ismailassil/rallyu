import { app as fastify } from './app.js';
import proxy from '@fastify/http-proxy';
import dotenv from 'dotenv';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyMetrics, { IMetricsPluginOptions } from 'fastify-metrics';
import { FastifyReply, FastifyRequest } from 'fastify';

dotenv.config();

// CORS Plugin
await fastify.register(cors, {
	origin: ['http://localhost:3000'], // Should be specified to the frontend
	allowedHeaders: ['Content-Type', 'Authorization'],
});

// HELMET Plugin
await fastify.register(helmet, {
	global: true,
});

// PROXY Plugin
const authProxyOptions = {
	upstream: 'http://localhost:3300',
	prefix: '/api/auth',
	rewritePrefix: '/auth',
	httpMethods: ['GET', 'POST', 'DELETE', 'PUT'],
};

fastify.register(proxy, authProxyOptions);
fastify.register(fastifyMetrics, { endpoint: '/inter-metrics' });

fastify.addHook('preHandler', async (req: FastifyRequest, rep: FastifyReply) => {
	if (req.url === '/inter-metrics') {
		const auth = req.headers['authorization'];
		const expected = 'Basic ' + Buffer.from('').toString('base64'); // TODO: .env

		if (auth !== expected) {
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

const PORT = parseInt(process.env.PORT || '5000');

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
