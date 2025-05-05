import AuthServices from '../../services/auth.services.js';
import { FastifyReply, FastifyRequest } from 'fastify';
import { extractToken, unsignToken } from '../utils/jwt.js';
import { app as fastify } from '../../../app.js';

async function refreshTokenHook(
	this: AuthServices,
	req: FastifyRequest,
	res: FastifyReply,
) {
	try {
		const token = extractToken(req, 'cookie');
		if (!token) {
			throw new Error('Authorization header missing.');
		}

		const cookieToken = unsignToken(fastify, token);

		const user = await this.verifyToken(
			cookieToken,
			req.headers['user-agent'] || 'unknown',
			'cookie',
		);

		req.user = user;
	} catch (err) {
		return res
			.status(401)
			.send({ error: (err as Error)?.message || 'Unknow Error Occurred.' });
	}
}

export default refreshTokenHook;
