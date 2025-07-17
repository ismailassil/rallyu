import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fetchHistorySchema from '../schemas/fetchHistory.schema';

const schemasPlugin = fastifyPlugin(async function (fastify: FastifyInstance) {
	fastify.addSchema(fetchHistorySchema);
});

export default schemasPlugin;
