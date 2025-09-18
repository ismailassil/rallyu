import initializeApp from "./app";
import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import dotenv from 'dotenv';
import { appConfig } from "./config";
const UAParser = require('ua-parser-js');

dotenv.config();

async function main() {
	const fastify: FastifyInstance = await initializeApp();
	
	fastify.get('/', (request: FastifyRequest, reply: FastifyReply) => {
		reply.code(200).send('pong');
	});

	fastify.listen({ host: '0.0.0.0', port: 5005 }, (err: Error | null, address: string) => {
		if (err)
			process.exit(1);
		console.log(`Authentication Server is listening on 5005...`);
	});
}

main();

export default fastify;