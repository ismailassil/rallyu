import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import AuthResponseFactory from '../controllers/AuthResponseFactory';

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.setErrorHandler((error, request, reply) => {
		fastify.log.error({
			err: error,
			reqId: request.id,
			url: request.url,
			method: request.method,
		}, `[ERROR] ${error.message}`);

		const { status, body } = AuthResponseFactory.getErrorResponse(error, false);

		reply.code(status).send(body);
	});
};

export default fp(errorHandlerPlugin, {
	name: 'errorHandlerPlugin',
});
