import fastifyJwt from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

const jwtPlugin = fp(async function (fastify: FastifyInstance) {
	fastify.register(fastifyJwt, {
		secret: process.env.JWT_SIGNING_KEY || 'something_not_safe',
	});

	fastify.decorate(
		'jwtAuth',
		async function (req: FastifyRequest, res: FastifyReply) {
			try {
				await req.jwtVerify();
			} catch (err) {
				res.status(401).send({ message: 'Unauthorized' });
			}
		},
	);
});

export default jwtPlugin;
