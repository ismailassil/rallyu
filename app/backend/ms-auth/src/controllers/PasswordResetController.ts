import PasswordResetService from "../services/Auth/PasswordResetService";
import { FastifyRequest, FastifyReply } from "fastify";
import AuthResponseFactory from "./AuthResponseFactory";
import { UUID } from "crypto";

class PasswordResetController {
	constructor(
		private passwordResetService: PasswordResetService
	) {}

	async requestHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { email } = request.body as { email: string };

			const token = await this.passwordResetService.setup(email);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { token });

			return reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async verifyHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { token, code } = request.body as { token: string, code: string };

			await this.passwordResetService.verify(token as UUID, code);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async useHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { token, newPassword } = request.body as { token: string, newPassword: string };;

			await this.passwordResetService.update(token as UUID, newPassword);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async resendHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { token } = request.body as { token: string };

			await this.passwordResetService.resend(token as UUID);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}
}

export default PasswordResetController;
