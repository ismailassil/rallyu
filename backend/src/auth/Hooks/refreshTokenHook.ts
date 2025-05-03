import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

function refreshTokenHook(
	this: FastifyInstance,
	req: FastifyRequest,
	res: FastifyReply,
) {}

export default refreshTokenHook;
