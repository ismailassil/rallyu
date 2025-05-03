import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

function authenticationHook(
	this: FastifyInstance,
	req: FastifyRequest,
	res: FastifyReply,
) {}

export default authenticationHook;
