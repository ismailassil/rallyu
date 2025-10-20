import { FastifyReply, FastifyRequest } from "fastify";
import { getBearerToken } from "../auth/utils";

export async function attachTokensHook(request: FastifyRequest, reply: FastifyReply) {
	const bearerToken = getBearerToken(request.headers.authorization) || null;
	const refreshToken = request.cookies?.['refreshToken'] || null;

	request.bearerToken = bearerToken;
	request.refreshToken = refreshToken;

	request.server.log.debug({
		bearerToken: request.bearerToken,
		refreshToken: request.refreshToken
	}, '[HOOK] attachTokensHook');
}
