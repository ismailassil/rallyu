import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import AuthResponseFactory from '../controllers/AuthResponseFactory';

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.setErrorHandler((error, request, reply) => {
		fastify.log.error({
			reqId: request.id,
			url: request.url,
			method: request.method,
			err: error,
		}, `[HOOKS] ${error.message}`);

		const { status, body } = AuthResponseFactory.getErrorResponse(error, false);
		reply.code(status).send(body);
	});
};

export default fp(errorHandlerPlugin, {
	name: 'errorHandlerPlugin',
});
