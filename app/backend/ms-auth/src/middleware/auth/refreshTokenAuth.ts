import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../types/exceptions/AAuthError";
import JWTUtils from "../../utils/auth/JWTUtils";
import { authConfig } from "../../config/auth";

export default async function refreshTokenAuth(request: FastifyRequest, reply: FastifyReply) {
	request.server.log.trace("[HOOK] REFRESH TOKEN AUTH: STARTED");

	const refreshToken = request.refreshToken;
	if (!refreshToken) throw new UnauthorizedError();

	const _JWTUtils = new JWTUtils(authConfig);

	try {
		const decodedJWTRefreshPayload = await _JWTUtils.verifyRefreshToken(refreshToken);
		request.refreshToken = refreshToken;
		request.refreshTokenPayload = decodedJWTRefreshPayload;

		request.server.log.trace(
			{
				refToken: request.refreshToken,
				user: request.user,
				refPayload: request.refreshTokenPayload,
			},
			"[HOOK] REFRESH TOKEN AUTH: SUCCESS",
		);
	} catch {
		reply.setCookie("refreshToken", "", {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			expires: new Date(0),
		});
		throw new UnauthorizedError();
	}
}
