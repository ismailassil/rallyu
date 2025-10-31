import { FastifyReply, FastifyRequest } from "fastify";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "../../types/exceptions/AAuthError";
import logger from "../../utils/misc/logger";

export default async function resourceOwnershipAuth(request: FastifyRequest, reply: FastifyReply) {
	logger.trace('[HOOK] RESOURCE OWNERSHIP AUTH: STARTED');

	if (!request.accessTokenPayload)
		throw new UnauthorizedError();

	const { id: resourceOwnerUserId } = request.params as { id: number };
	if (!resourceOwnerUserId)
		throw new BadRequestError();

	const requesterUserId = request.accessTokenPayload.sub;
	if (!requesterUserId)
		throw new UnauthorizedError();

	if (resourceOwnerUserId !== requesterUserId)
		throw new ForbiddenError();

	logger.trace({
		resourceOwnerUserId,
		requesterUserId,
		accPayload: request.accessTokenPayload
	}, '[HOOK] RESOURCE OWNERSHIP AUTH: SUCCESS');
}
