import { FastifyPluginAsync } from 'fastify';
import 'fastify';
import '@fastify/jwt';
import ILoginBody from '../../Routes/types/ILoginBody';
import { userJWT } from '../../Repositories/types';

declare module 'fastify' {
	interface FastifyInstance {
		authenticate: any;
		authRefreshToken: any;
	}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		user: userJWT;
	}
}
