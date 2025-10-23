import { FastifyReply, FastifyRequest } from "fastify";
import VerificationService from "../services/Auth/VerificationService";
import AuthResponseFactory from "./AuthResponseFactory";
import { UUID } from "crypto";
import { authRoutesZodSchemas as zodSchemas } from "../schemas/zod/auth.zod.schema";
import logger from "../utils/misc/logger";

class VerificationController {
	constructor(
		private verificationService: VerificationService
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

		await this.verificationService.verify(token as UUID, code);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	async resendHandler(request: FastifyRequest, reply: FastifyReply) {
		const { token } = request.body as { token: string };

		await this.verificationService.resend(token as UUID);

		const { status, body } = AuthResponseFactory.getSuccessResponse(201, {});
		return reply.code(status).send(body);
	}
}

export default VerificationController;
