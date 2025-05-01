import { FastifyPluginAsync } from 'fastify';
import 'fastify';

declare module 'fastify' {
	interface FastifyInstance {
		jwtAuth: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
	}
}
