import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../types/exceptions/AAuthError";
import { env } from "../../config/env";

export default async function apiKeyAuth(request: FastifyRequest, reply: FastifyReply) {
	const apiKey = request.bearerToken;
	if (!apiKey)
		throw new UnauthorizedError();

	try {
		if (env.API_KEY !== apiKey)
			throw new UnauthorizedError();

		request.apiKey = apiKey;

		request.server.log.debug({
			apiKey: request.apiKey
		}, '[HOOK] apiKeyAuth');
	} catch {
		throw new UnauthorizedError();
	}
}
