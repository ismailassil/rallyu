import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../types/exceptions/AAuthError";
import { env } from "../../config/env";
import logger from "../../utils/misc/logger";

export default async function apiKeyAuth(request: FastifyRequest, reply: FastifyReply) {
	logger.trace('[HOOK] API KEY AUTH: STARTED');

	const apiKey = request.bearerToken;
	if (!apiKey)
		throw new UnauthorizedError();

	try {
		if (env.API_KEY !== apiKey)
			throw new UnauthorizedError();

		request.apiKey = apiKey;

		logger.trace({
			apiKey: request.apiKey
		}, '[HOOK] API KEY AUTH: SUCCESS');
	} catch {
		throw new UnauthorizedError();
	}
}
