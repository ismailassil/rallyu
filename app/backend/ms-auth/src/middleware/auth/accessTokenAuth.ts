import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../types/exceptions/AAuthError";
import JWTUtils from "../../utils/auth/JWTUtils";
import { authConfig } from "../../config/auth";

export default async function accessTokenAuth(request: FastifyRequest, reply: FastifyReply) {
	const accessToken = request.bearerToken;
	if (!accessToken)
		throw new UnauthorizedError();

	const _JWTUtils = new JWTUtils(authConfig);

	try {
		const decodedJWTAccessPayload = await _JWTUtils.verifyAccessToken(accessToken);
		request.user = decodedJWTAccessPayload;
		request.accessToken = accessToken;
		request.accessTokenPayload = decodedJWTAccessPayload;

		request.server.log.debug({
			accToken: request.accessToken,
			user: request.user,
			accPayload: request.accessTokenPayload
		}, '[HOOK] accessTokenAuth');
	} catch {
		throw new UnauthorizedError();
	}
}
