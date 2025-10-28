import { FastifyReply, FastifyRequest } from "fastify";
import VerificationService from "../services/Auth/VerificationService";
import AuthResponseFactory from "./AuthResponseFactory";
import { UUID } from "crypto";
import { authRoutesZodSchemas as zodSchemas } from "../schemas/zod/auth.zod.schema";
import logger from "../utils/misc/logger";
import { JSONCodec } from "nats";

class VerificationController {
	constructor(
		private verificationService: VerificationService,
		private nats: any,
		private js: any
	) {}

	async requestHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		const contact = request.raw.url?.includes('email') ? 'email' : 'phone';
		const { target } = request.body as { target: string };

		const token = await this.verificationService.request(contact, user_id!, target);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, { token });
		return reply.code(status).send(body);
	}

	async verifyHandler(request: FastifyRequest, reply: FastifyReply) {
		const { token, code } = request.body as { token: string, code: string };

		const verifiedUserId = await this.verificationService.verify(token as UUID, code);
		this.publishUserRefreshRequiredToUser(verifiedUserId);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	async resendHandler(request: FastifyRequest, reply: FastifyReply) {
		const { token } = request.body as { token: string };

		await this.verificationService.resend(token as UUID);

		const { status, body } = AuthResponseFactory.getSuccessResponse(201, {});
		return reply.code(status).send(body);
	}

	private publishUserRefreshRequiredToUser(userId: number) {
		if (!this.nats || !this.js)
			return ;

		const _JSONCodec = JSONCodec();
		this.nats.publish('gateway.user.data', _JSONCodec.encode({
			eventType: 'USER_UPDATE',
			recipientUserIds: [userId],
			data: {
				requesterId: userId,
				receiverId: userId,
				status: 'REFRESH_REQUIRED'
			}
		}));
	}
}

export default VerificationController;
