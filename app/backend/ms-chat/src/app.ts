import Fastify, { FastifyInstance } from 'fastify';

const fastify: FastifyInstance = Fastify({
	logger: {
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
			},
		},
	},
});

export default fastify;
