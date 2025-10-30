import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import createError from '@fastify/error';
import AuthResponseFactory from '../controllers/AuthResponseFactory';
import AuthError from '../types/exceptions/AAuthError';

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.setErrorHandler((error, request, reply) => {
		fastify.log.error({
			reqId: request.id,
			url: request.url,
			method: request.method,
			err: error,
		}, `[HOOKS] ${error.message}`);

		if (!(error instanceof AuthError))
			throw error;

		const { status, body } = AuthResponseFactory.getErrorResponse(error, false);
		reply.code(status).send(body);
	});
};

export default fp(errorHandlerPlugin, {
	name: 'errorHandlerPlugin',
});
