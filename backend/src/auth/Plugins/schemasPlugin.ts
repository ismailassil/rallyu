import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import loginSchema from '../Schemas/loginSchema.js';
import registerSchema from '../Schemas/registerSchema.js';
import responseSchema from '../Schemas/responseSchema.js';

const schemasPlugin = fp(async function (fastify: FastifyInstance) {
	fastify.addSchema(loginSchema);
	fastify.addSchema(registerSchema);
	fastify.addSchema(responseSchema);
});

export default schemasPlugin;
