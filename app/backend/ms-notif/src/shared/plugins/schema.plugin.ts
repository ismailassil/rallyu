import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import responseSchema from '../schemas/response.schema.js';
import historySchema from '../schemas/history.schema.js';
import updateSchema from '../schemas/update.schema.js';

const schemasPlugin = fp(async function (fastify: FastifyInstance) {
	fastify.addSchema(responseSchema);
	fastify.addSchema(historySchema);
	fastify.addSchema(updateSchema);
});

export default schemasPlugin;
