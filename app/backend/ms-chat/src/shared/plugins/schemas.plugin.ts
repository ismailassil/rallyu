import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fetchSchema from '../schemas/fetch.schema';

const schemasPlugin = fastifyPlugin(async function (fastify: FastifyInstance) {
	fastify.addSchema(fetchSchema);
});

export default schemasPlugin;
