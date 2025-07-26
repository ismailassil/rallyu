import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import historySchema from '../schemas/history.schema';
import searchSchema from '../schemas/search.schema';

const schemasPlugin = fastifyPlugin(async function (fastify: FastifyInstance) {
	fastify.addSchema(historySchema);
	fastify.addSchema(searchSchema);
});

export default schemasPlugin;
