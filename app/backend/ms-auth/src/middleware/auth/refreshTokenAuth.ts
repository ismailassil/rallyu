import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../types/exceptions/AAuthError";
import JWTUtils from "../../utils/auth/JWTUtils";
import { authConfig } from "../../config/auth";
import logger from "../../utils/misc/logger";

export default async function refreshTokenAuth(request: FastifyRequest, reply: FastifyReply) {
	logger.trace('[HOOK] REFRESH TOKEN AUTH: STARTED');

	const refreshToken = request.refreshToken;
	if (!refreshToken)
		throw new UnauthorizedError();

	const _JWTUtils = new JWTUtils(authConfig);

	try {
		const decodedJWTRefreshPayload = await _JWTUtils.verifyRefreshToken(refreshToken);
		request.refreshToken = refreshToken;
		request.refreshTokenPayload = decodedJWTRefreshPayload;

		logger.trace({
			refToken: request.refreshToken,
			user: request.user,
			refPayload: request.refreshTokenPayload
		}, '[HOOK] REFRESH TOKEN AUTH: SUCCESS');
	} catch {
		reply.setCookie(
			'refreshToken', '', {
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'lax',
				expires: new Date(0)
			}
		); throw new UnauthorizedError();
	}
}
