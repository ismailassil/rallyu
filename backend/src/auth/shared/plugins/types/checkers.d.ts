import 'fastify';

declare module 'fastify' {
	interface FastifyInstance {
		pwdCheker: (password: string) => boolean;
		userChecker: (username: string) => boolean;
	}
}
