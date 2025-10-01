import { FastifyReply, FastifyRequest } from "fastify";
import AuthResponseFactory from "./AuthResponseFactory";
import TwoFactorMethodService from "../services/TwoFactorAuth/TwoFactorMethodService";

class TwoFactorController {
	constructor(
		private twoFactorService: TwoFactorMethodService
	) {}

	async fetchEnabledMethodsHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub as number;

			const enabledMethods = await this.twoFactorService.getEnabledMethods(user_id);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, enabledMethods);

			reply.status(status).send(body);

		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async setupInitHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub as number;
			const { method } = request.params as { method: 'TOTP' | 'SMS' | 'EMAIL' };
			const methodNormalized = method.toUpperCase();

			const totpSecretsOrCode = await this.twoFactorService.createPending(methodNormalized as 'TOTP' | 'SMS' | 'EMAIL', user_id);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, methodNormalized === 'TOTP' ? { totpSecretsOrCode } : {});

			reply.status(status).send(body);

		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async setupVerifyHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub as number;
			const { method } = request.params as { method: 'TOTP' | 'SMS' | 'EMAIL' };
			const { code } = request.body as { code: string };
			const methodNormalized = method.toUpperCase();

			await this.twoFactorService.enablePending(methodNormalized as 'TOTP' | 'SMS' | 'EMAIL', code, user_id);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			reply.status(status).send(body);

		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async disableMethodHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub as number;
			const { method } = request.params as { method: 'TOTP' | 'SMS' | 'EMAIL' };
			const methodNormalized = method.toUpperCase();

			await this.twoFactorService.disableEnabled(methodNormalized as 'TOTP' | 'SMS' | 'EMAIL', user_id);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			reply.status(status).send(body);

		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}
}

export default TwoFactorController;