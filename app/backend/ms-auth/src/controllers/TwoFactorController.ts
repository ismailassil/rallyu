import { FastifyReply, FastifyRequest } from "fastify";
import AuthResponseFactory from "./AuthResponseFactory";
import TwoFactorMethodService from "../services/TwoFactorAuth/TwoFactorMethodService";
import z from "zod";
import { UUID } from "crypto";
import { AuthChallengeMethod } from "../repositories/AuthChallengesRepository";
import { zodResendSchema, zodVerifyChallengeBodySchema } from "../schemas/zod/auth.zod.schema";

class TwoFactorController {
	constructor(
		private twoFactorService: TwoFactorMethodService
	) {}

	async setupTOTPHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub as number;
			const { method } = request.query as { method: AuthChallengeMethod };

			const tokenAndSecrets = await this.twoFactorService.setupTOTP('TOTP', user_id);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, tokenAndSecrets);

			return reply.status(status).send(body);

		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async verifyTOTPHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { token, code } = request.body as z.infer<typeof zodVerifyChallengeBodySchema>;

			await this.twoFactorService.enableTOTP(token as UUID, code);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.status(status).send(body);

		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async fetchEnabledMethodsHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub as number;

			const enabledMethods = await this.twoFactorService.getEnabledMethods(user_id);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, enabledMethods);

			return reply.status(status).send(body);

		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async enableMethodHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub as number;
			const { method } = request.params as { method: AuthChallengeMethod };

			await this.twoFactorService.enable(method, user_id);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.status(status).send(body);

		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async disableMethodHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub as number;
			const { method } = request.params as { method: AuthChallengeMethod };

			await this.twoFactorService.disableEnabled(method, user_id);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.status(status).send(body);

		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}
}

export default TwoFactorController;
