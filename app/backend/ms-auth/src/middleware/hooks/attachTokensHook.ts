import { FastifyReply, FastifyRequest } from "fastify";
import { getBearerToken } from "../auth/utils";

export async function attachTokensHook(request: FastifyRequest, reply: FastifyReply) {
	request.server.log.trace('[HOOK] ATTACHING TOKENS: STARTED');

	const bearerToken = getBearerToken(request.headers.authorization) || null;
	const refreshToken = request.cookies?.['refreshToken'] || null;

	request.bearerToken = bearerToken;
	request.refreshToken = refreshToken;

	request.server.log.trace({
		bearerToken: request.bearerToken,
		refreshToken: request.refreshToken
	}, '[HOOK] ATTACHING TOKENS: SUCCESS');
}
