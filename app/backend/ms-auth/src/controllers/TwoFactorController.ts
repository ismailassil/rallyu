import { FastifyReply, FastifyRequest } from "fastify";
import AuthResponseFactory from "./AuthResponseFactory";
import TwoFactorMethodService from "../services/TwoFactorAuth/TwoFactorMethodService";
import { UUID } from "crypto";
import { AuthChallengeMethod } from "../repositories/AuthChallengesRepository";

class TwoFactorController {
	constructor(
		private twoFactorService: TwoFactorMethodService
	) {}

	async setupTOTPHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub as number;

		const tokenAndSecrets = await this.twoFactorService.setupTOTP('TOTP', user_id);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, tokenAndSecrets);
		return reply.status(status).send(body);
	}

	async verifyTOTPHandler(request: FastifyRequest, reply: FastifyReply) {
		const { token, code } = request.body as { token: string, code: string };

		await this.twoFactorService.enableTOTP(token as UUID, code);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.status(status).send(body);
	}

	async fetchEnabledMethodsHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub as number;

		const enabledMethods = await this.twoFactorService.getEnabledMethods(user_id);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, enabledMethods);
		return reply.status(status).send(body);
	}

	async enableMethodHandler(request: FastifyRequest, reply: FastifyReply) {
			const user_id = request.user?.sub as number;
		const { method } = request.params as { method: AuthChallengeMethod };

		await this.twoFactorService.enable(method, user_id);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.status(status).send(body);
	}

	async disableMethodHandler(request: FastifyRequest, reply: FastifyReply) {
			const user_id = request.user?.sub as number;
		const { method } = request.params as { method: AuthChallengeMethod };

		await this.twoFactorService.disableEnabled(method, user_id);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.status(status).send(body);
	}
}

export default TwoFactorController;
