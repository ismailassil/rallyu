import fastify, { FastifyInstance } from "fastify";

const app: FastifyInstance = fastify({
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				colorize: true,
			},
		},
	},
});

export { app };
