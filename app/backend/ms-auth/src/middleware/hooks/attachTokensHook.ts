import { FastifyReply, FastifyRequest } from "fastify";
import { getBearerToken } from "../auth/utils";
import logger from "../../utils/misc/logger";

export async function attachTokensHook(request: FastifyRequest, reply: FastifyReply) {
	logger.trace('[HOOK] ATTACHING TOKENS: STARTED');

	const bearerToken = getBearerToken(request.headers.authorization) || null;
	const refreshToken = request.cookies?.['refreshToken'] || null;

	request.bearerToken = bearerToken;
	request.refreshToken = refreshToken;

	logger.trace({
		bearerToken: request.bearerToken,
		refreshToken: request.refreshToken
	}, '[HOOK] ATTACHING TOKENS: SUCCESS');
}
