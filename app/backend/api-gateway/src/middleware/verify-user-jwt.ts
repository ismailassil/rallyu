import { FastifyReply, FastifyRequest } from 'fastify';
import { JWT_ACCESS_PAYLOAD } from '../types/jwt.types';
import { app as fastify } from '../app.js';
import chalk from 'chalk';

export const verifyUserJWT = async (req: FastifyRequest, rep: FastifyReply) => {
	fastify.log.info(chalk.bgYellow(req.url));
	if (shouldIgnorePath(req.url)) return;

	fastify.log.info('PASSED URL: ' + req.url);

	// TODO: Verify the JWT Here
	let accessToken: string = "";

	const isWebSocket = req.url.startsWith('/api/v1/matchmaking/join?token');
	const authHeader = req.headers.authorization as string;

	fastify.log.info(chalk.bgGreen(authHeader))
	fastify.log.info(chalk.bgGreen(isWebSocket))
	
	if (isWebSocket) {
		accessToken = (req.query  as { token: string }).token;
	} else if (authHeader) {
		accessToken = authHeader?.startsWith('Bearer ')
			? authHeader.slice(7)
			: authHeader;
	} else {
		return rep.code(401).send({ success: false, error: 'Access token required!' });
	}

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

function shouldIgnorePath(path: string): boolean {
	const allRoutes = [
		'/health',
		'/api/auth/refresh',
		'/api/auth/login',
		'/api/auth/register',
	];

	const avatarPath = '/api/users/avatars';
	const availablePath = '/api/users/available';
	const resetPath = 'api/auth/reset';
	const searchTEMP = '/api/users/search';

	return (
		allRoutes.includes(path) ||
		path.startsWith(avatarPath) ||
		path.startsWith(availablePath) ||
		path.startsWith(resetPath) ||
		path.startsWith(searchTEMP)
	);
}
