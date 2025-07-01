import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import notifySchema from '../schemas/notification.schema.js';
import responseSchema from '../schemas/response.schema.js';

const schemasPlugin = fp(async function (fastify: FastifyInstance) {
	fastify.addSchema(responseSchema);
	fastify.addSchema(notifySchema);
});

export default schemasPlugin;
