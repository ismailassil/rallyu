import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../types/exceptions/AAuthError";
import JWTUtils from "../../utils/auth/JWTUtils";
import { authConfig } from "../../config/auth";

export default async function refreshTokenAuth(request: FastifyRequest, reply: FastifyReply) {
	const refreshToken = request.refreshToken;
	if (!refreshToken)
		throw new UnauthorizedError();

	const _JWTUtils = new JWTUtils(authConfig);

	try {
		const decodedJWTRefreshPayload = await _JWTUtils.verifyRefreshToken(refreshToken);
		request.refreshToken = refreshToken;
		request.refreshTokenPayload = decodedJWTRefreshPayload;

		request.server.log.debug({
			refToken: request.refreshToken,
			user: request.user,
			refPayload: request.refreshTokenPayload
		}, '[HOOK] refreshTokenAuth');
	} catch {
		throw new UnauthorizedError();
	}
}
