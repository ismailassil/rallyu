import { FastifyReply, FastifyRequest } from "fastify";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "../../types/exceptions/AAuthError";

export default async function resourceOwnershipAuth(request: FastifyRequest, reply: FastifyReply) {
	request.server.log.trace('[HOOK] RESOURCE OWNERSHIP AUTH: STARTED');

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

	request.server.log.trace({
		resourceOwnerUserId,
		requesterUserId,
		accPayload: request.accessTokenPayload
	}, '[HOOK] RESOURCE OWNERSHIP AUTH: SUCCESS');
}
