import ResetPasswordService from "../services/resetService";
import { FastifyRequest, FastifyReply } from "fastify";
import { IResetPasswordRequest, IResetPasswordUpdateRequest, IResetPasswordVerifyRequest } from "../types";
import AuthResponseFactory from "./authResponseFactory";

class ResetController {
	private resetService: ResetPasswordService;

	constructor() {
		this.resetService = new ResetPasswordService;
	}

	async ResetPasswordSetupEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const { email } = request.body as IResetPasswordRequest;

		if (!email)
			reply.status(400).send({ success: true, data: {} });

		try {
			const success = await this.resetService.setup(email);
			if (success)
				reply.code(200);
			else
				reply.code(404);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async ResetPasswordVerifyEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const { email, code } = request.body as IResetPasswordVerifyRequest;

		if (!email || !code)
			reply.status(400).send({ success: true, data: {} });

		try {
			const success = await this.resetService.verify(email, code);
			if (success)
				reply.code(200);
			else
				reply.code(404);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async ResetPasswordUpdateEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const { email, code, password } = request.body as IResetPasswordUpdateRequest;

		if (!email || !code || !password)
			reply.status(400).send({ success: true, data: {} });

		try {
			const success = await this.resetService.update(email, code, password);
			if (success)
				reply.code(200);
			else
				reply.code(404);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}
}

export default ResetController;