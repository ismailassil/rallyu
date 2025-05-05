import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import loginSchema from '../schemas/login.schema.js';
import registerSchema from '../schemas/register.schema.js';
import responseSchema from '../schemas/response.schema.js';

const schemasPlugin = fp(async function (fastify: FastifyInstance) {
	fastify.addSchema(loginSchema);
	fastify.addSchema(registerSchema);
	fastify.addSchema(responseSchema);
});

export default schemasPlugin;
