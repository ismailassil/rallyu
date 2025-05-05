import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import cookie, { CookieSerializeOptions } from '@fastify/cookie';

const cookiePlugin = fp(async function (fastify: FastifyInstance) {
	fastify.register(cookie, {
		secret: process.env.COOKIE_SECRET,
		hook: 'preValidation',
		parseOptions: {
			secure: false, // this option if true will make sure that the cookie only passed through the HTTPS
			signed: true,
		},
	});

	fastify.decorateReply(
		'setRefreshTokenCookie',
		function (this: FastifyReply, value: string) {
			return this.setCookie('refresh_token', value, {
				httpOnly: true,
				secure: false,
				sameSite: 'strict',
				signed: true,
				path: '/api',
			});
		},
	);
});

export default cookiePlugin;
