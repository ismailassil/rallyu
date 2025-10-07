import { FastifyInstance, FastifyReply, FastifyRequest, preHandlerHookHandler } from "fastify";
import Authenticate from "../middleware/Authenticate";
import authRouter from "../routes/AuthRouter";

// PLUGIN THAT ADDS AuthN + AuthZ TO FASTIFY APP
// DECORATE FASTIFY INSTANCE / REQUEST / RESPONSE
async function authPlugin(fastify: FastifyInstance) {
	fastify.decorate('authenticate', Authenticate); // auth middleware for protected routes
	fastify.decorate('requireAuth', { preHandler: fastify.authenticate }); // preHandler hook
	fastify.decorateRequest('user', null);

	fastify.get('/public', async (request: FastifyRequest, reply: FastifyReply) => {
		reply.send({ data: 'This is some insensitive data.' });
	});
	
	fastify.get('/protected', fastify.requireAuth, async (request: FastifyRequest, reply: FastifyReply) => {
		reply.send({ data: 'This is some sensitive data, only users can see it.' });
	});

	fastify.register(authRouter, { prefix: '/'});
}

export default authPlugin;