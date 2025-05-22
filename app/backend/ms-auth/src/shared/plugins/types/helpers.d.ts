import 'fastify';

declare module 'fastify' {
	interface FastifyInstance {
		isEmpty: (...vargs: string[]) => boolean;
	}
}
