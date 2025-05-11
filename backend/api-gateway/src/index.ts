import { app as fastify } from './app.js';
import proxy from '@fastify/http-proxy';
import dotenv from 'dotenv';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

dotenv.config();

// CORS Plugin
await fastify.register(cors, {
	origin: ['*'], // Should be specified to the frontend
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

const PORT = parseInt(process.env.PORT || '5000');

async function main() {
	try {
		const address = await fastify.listen({ port: PORT });
		fastify.log.info(`Server is running at ${address}`);
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
}

main();
