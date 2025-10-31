import initializeApp from "./app";
import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { env } from "./config/env";
import logger from "./utils/misc/logger";

async function main() {
	process.on('uncaughtException', err => {
		logger.error({ err }, '[PROCESS] Uncaught Exception');
		// process.exit(1);
	});

	process.on('unhandledRejection', err => {
		logger.error({ err }, '[PROCESS] Uncaught Rejection');
		// process.exit(1);
	});

	const fastify: FastifyInstance = await initializeApp();

	fastify.get('/ping', (request: FastifyRequest, reply: FastifyReply) => {
		return reply.code(200).send('pong');
	});

	fastify.listen({ host: '0.0.0.0', port: env.PORT }, (err: Error | null, address: string) => {
		if (err) {
			fastify.log.error({ err }, '[SERVER] Cannot start HTTP Server');
			process.exit(1);
		}
		fastify.log.info(`[SERVER] Server listening at ${address}:${env.PORT}`);
	});
}

main();

export default fastify;
