import { FastifyInstance, FastifyRequest } from 'fastify';

export function extractToken(req: FastifyRequest, tokenSource: 'header' | 'cookie') {
	const token =
		tokenSource === 'header'
			? req.headers.authorization
			: req.cookies?.refresh_token;
	if (!token)
		throw new Error(
			`Unauthorized: ${tokenSource === 'header' ? 'Access' : 'Refresh'} token is missing`,
		);

	return token;
}

export function unsignToken(fastify: FastifyInstance, token: string) {
	const { value, valid } = fastify.unsignCookie(token);
	if (!valid || !value)
		throw new Error('Invalid or expired token: Unable to verify');
	return value;
}
