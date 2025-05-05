import { FastifyReply, FastifyRequest } from 'fastify';
import { extractToken } from '../utils/jwt.js';
import AuthServices from '../../services/auth.services.js';

async function authenticationHook(
	this: AuthServices,
	req: FastifyRequest,
	res: FastifyReply,
) {
	try {
		const token = extractToken(req, 'header');
		if (!token) {
			throw new Error('Authorization header missing');
		}

		const user = await this.verifyToken(
			token,
			req.headers['user-agent'] || 'unknown',
			'header',
		);

		req.user = user;
	} catch (err) {
		return res
			.status(401)
			.send({ error: (err as Error)?.message || 'Unknow Error Occurred.' });
	}
}

export default authenticationHook;
