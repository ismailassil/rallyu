import PasswordResetService from "../services/Auth/passwordResetService";
import { FastifyRequest, FastifyReply } from "fastify";
import { IResetPasswordRequest, IResetPasswordUpdateRequest, IResetPasswordVerifyRequest } from "../types";
import AuthResponseFactory from "./authResponseFactory";

class PasswordResetController {
	constructor(
		private passwordResetService: PasswordResetService
	) {}

	async resetPasswordSetupHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { email } = request.body as IResetPasswordRequest;

			await this.passwordResetService.setup(email);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async resetPasswordVerifyHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { email, code } = request.body as IResetPasswordVerifyRequest;

			await this.passwordResetService.verify(email, code);
			
			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async resetPasswordUpdateHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { email, code, newPassword } = request.body as IResetPasswordUpdateRequest;

			await this.passwordResetService.update(email, code, newPassword);
			
			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}
}

export default PasswordResetController;