import 'fastify';

declare module 'fastify' {
	interface FastifyReply {
		setRefreshTokenCookie: (
			this: FastifyReply,
			value: string,
		) => FastifyReply<
			RouteGenericInterface,
			RawServerDefault,
			IncomingMessage,
			ServerResponse<IncomingMessage>,
			unknown,
			FastifySchema,
			FastifyTypeProviderDefault,
			unknown
		>;
	}
}
