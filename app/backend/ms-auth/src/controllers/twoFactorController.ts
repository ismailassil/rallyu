import { FastifyReply, FastifyRequest } from "fastify";
import TwoFactorService from "../services/twoFactorService";
import AuthResponseFactory from "./authResponseFactory";


// THIS CONTROLLER WILL ONLY CONTAIN ENDPOINTS 2FA METHODS SETUP
class TwoFactorController {
	constructor(
		private twoFactorService: TwoFactorService
	) {}

	/*----------------------------------- ENABLED METHODS -----------------------------------*/

	async EnabledMethodsEndpoint(request: FastifyRequest, reply: FastifyReply) {
		try {
			// TODO: ADD SCHEMA
			const user_id = request.user?.sub as number;

			const enabledMethods = await this.twoFactorService.getEnabledMethods(user_id);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, enabledMethods);

			reply.status(status).send(body);

		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	
	/*---------------------------------------- SETUP ----------------------------------------*/

	async SetupInitEndpoint(request: FastifyRequest, reply: FastifyReply) {
		try {
			// TODO: ADD SCHEMA
			const user_id = request.user?.sub as number;
			const { method } = request.params as { method: string };

			const totpSecrets = await this.twoFactorService.createPending2FAMethod(method, user_id);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, totpSecrets);

			reply.status(status).send(body);

		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async SetupVerifyEndpoint(request: FastifyRequest, reply: FastifyReply) {
		try {
			// TODO: ADD SCHEMA
			const user_id = request.user?.sub as number;
			const { method } = request.params as { method: string };
			const { code } = request.body as { code: string };

			await this.twoFactorService.enablePending2FAMethod(method, code, user_id);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			reply.status(status).send(body);

		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}
}

export default TwoFactorController;