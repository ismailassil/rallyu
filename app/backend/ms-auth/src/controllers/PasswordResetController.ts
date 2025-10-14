import PasswordResetService from "../services/Auth/PasswordResetService";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from 'zod';
import AuthResponseFactory from "./AuthResponseFactory";
import { UUID } from "crypto";
import { zodResendSchema, zodResetPasswordSchema, zodResetPasswordUpdateSchema, zodResetPasswordVerifySchema } from "../schemas/zod/auth.zod.schema";

class PasswordResetController {
	constructor(
		private passwordResetService: PasswordResetService
	) {}

	async requestHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { email } = request.body as z.infer<typeof zodResetPasswordSchema>;

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
			const { token, code } = request.body as z.infer<typeof zodResetPasswordVerifySchema>;

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
			const { token, newPassword } = request.body as z.infer<typeof zodResetPasswordUpdateSchema>;

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
			const { token } = request.body as z.infer<typeof zodResendSchema>;

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
