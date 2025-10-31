import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../types/exceptions/AAuthError";
import JWTUtils from "../../utils/auth/JWTUtils";
import { authConfig } from "../../config/auth";
import logger from "../../utils/misc/logger";

export default async function accessTokenAuth(request: FastifyRequest, reply: FastifyReply) {
	logger.trace('[HOOK] ACCESS TOKEN AUTH: STARTED');

	const accessToken = request.bearerToken;
	if (!accessToken)
		throw new UnauthorizedError();

	const _JWTUtils = new JWTUtils(authConfig);

	try {
		const decodedJWTAccessPayload = await _JWTUtils.verifyAccessToken(accessToken);
		request.user = decodedJWTAccessPayload;
		request.accessToken = accessToken;
		request.accessTokenPayload = decodedJWTAccessPayload;

		logger.trace({
			accToken: request.accessToken,
			user: request.user,
			accPayload: request.accessTokenPayload
		}, '[HOOK] ACCESS TOKEN AUTH: SUCCESS');
	} catch {
		throw new UnauthorizedError();
	}
}
