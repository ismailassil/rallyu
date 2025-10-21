import { FastifyReply, FastifyRequest } from "fastify";
import VerificationService from "../services/Auth/VerificationService";
import AuthResponseFactory from "./AuthResponseFactory";
import { UUID } from "crypto";

class VerificationController {
	constructor(
		private verificationService: VerificationService
	) {}

	async requestHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		const { contact } = request.params as { contact: 'email' | 'phone' };

		const token = await this.verificationService.request(contact, user_id!, (request.body as any)?.target);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, { token });
		return reply.code(status).send(body);
	}

	async verifyHandler(request: FastifyRequest, reply: FastifyReply) {
		const { token, code } = request.body as { token: string, code: string };

		await this.verificationService.verify(token as UUID, code);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, { token });
		return reply.code(status).send(body);
	}

	async resendHandler(request: FastifyRequest, reply: FastifyReply) {
		const { token } = request.body as { token: string };

		await this.verificationService.resend(token as UUID);

		const { status, body } = AuthResponseFactory.getSuccessResponse(201, { token });
		return reply.code(status).send(body);
	}
}

export default VerificationController;
