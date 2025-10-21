import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../types/exceptions/AAuthError";
import { env } from "../../config/env";

export default async function apiKeyAuth(request: FastifyRequest, reply: FastifyReply) {
	request.server.log.trace('[HOOK] API KEY AUTH: STARTED');

	const apiKey = request.bearerToken;
	if (!apiKey)
		throw new UnauthorizedError();

	try {
		if (env.API_KEY !== apiKey)
			throw new UnauthorizedError();

		request.apiKey = apiKey;

		request.server.log.trace({
			apiKey: request.apiKey
		}, '[HOOK] API KEY AUTH: SUCCESS');
	} catch {
		throw new UnauthorizedError();
	}
}
