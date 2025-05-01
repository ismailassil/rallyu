import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';
const jwtPlugin = fp(async function (fastify) {
    fastify.register(fastifyJwt, {
        secret: process.env.JWT_SIGNING_KEY || 'something_not_safe',
    });
    fastify.decorate('jwtAuth', async function (req, res) {
        try {
            await req.jwtVerify();
        }
        catch (err) {
            res.status(401).send({ message: 'Unauthorized' });
        }
    });
});
export default jwtPlugin;
