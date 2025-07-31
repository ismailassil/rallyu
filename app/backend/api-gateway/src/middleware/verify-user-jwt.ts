import { FastifyReply, FastifyRequest } from 'fastify';
import { JWT_ACCESS_PAYLOAD } from '../types/jwt.types';
import { app as fastify } from '../app.js';

export const verifyUserJWT = async (req: FastifyRequest, rep: FastifyReply) => {
	fastify.log.info(req.url)
	if (req.url === '/health') return;
	if (req.url === '/api/auth/refresh' || req.url === '/api/auth/login' || req.url === '/api/auth/register') return;

	// TODO: Verify the JWT Here
	const authHeader = req.headers.authorization as string;

	if (!authHeader)
		rep.code(401).send({ success: false, error: 'Access token required!' });

	const accessToken = authHeader.startsWith('Bearer ')
		? authHeader.slice(7)
		: authHeader;

	try {
		const res = fastify.jwt.verify(accessToken) as JWT_ACCESS_PAYLOAD;

		req.headers['x-user-id'] = res.sub.toString();
		req.headers['x-user-username'] = res.username;
	} catch (error) {
		fastify.log.info(`Unauthorized...`);
		let msg: string = 'AUTH_ERROR';
		if (
			((error as { code?: string }).code as string) ===
			'FAST_JWT:ERROR:EXPIRED'
		) {
			msg = 'AUTH_TOKEN_EXPIRED';
		}
		return rep.code(401).send({ success: false, error: msg });
	}
};
