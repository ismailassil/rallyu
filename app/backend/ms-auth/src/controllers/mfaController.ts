import TwoFactorService from "../services/twoFactorService";
import { FastifyRequest, FastifyReply } from "fastify";
import { I2FASetupRequest, I2FAConfirmRequest, I2FADisableRequest, IMFAVerifyRequest, IMFAEmailOTPInitRequest } from "../types";
import AuthResponseFactory from "./authResponseFactory";

class MFAController {
	constructor(
		private twoFactorService: TwoFactorService
	) {}

	// async Send2FALoginCode(request: FastifyRequest, reply: FastifyReply) {
	// 	const { session_id, method } = request.body as { session_id: number, method: string };

	// 	try {
	// 		await this.twoFactorService.send2FALoginCode(method, session_id);

	// 		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

	// 		reply.code(status).send(body);
	// 	} catch (err: any) {
	// 		const { status, body } = AuthResponseFactory.getErrorResponse(err);
			
	// 		reply.code(status).send(body);
	// 	}
	// }

	// async Verify2FALogin(request: FastifyRequest, reply: FastifyReply) {
	// 	// const user_id = request.user?.sub;
	// 	const { session_id, method, code } = request.body as { session_id: number, method: string, code: string };
		
	// 	try {
	// 		const { user, refreshToken, accessToken } = 
	// 			await this.twoFactorService.verify2FALoginCode(method, session_id, code);
			
	// 		const { status, body } = AuthResponseFactory.getSuccessResponse(200, { user, accessToken });

	// 		reply.code(status).setCookie(
	// 			'refreshToken', refreshToken, {
	// 				path: '/',
	// 				httpOnly: true,
	// 				secure: false,
	// 				sameSite: 'lax'
	// 			}
	// 		).send(body);
			
	// 	} catch (err: any) {
	// 		const { status, body } = AuthResponseFactory.getErrorResponse(err);
			
	// 		reply.code(status).send(body);
	// 	}
	// }
	
	// async getEnabledMethodsEndpoint(request: FastifyRequest, reply: FastifyReply) {
	// 	const user_id = request.user?.sub;
		
	// 	try {
	// 		const enabledMethods = await this.twoFactorService.getEnabledMethods(user_id!);
			
	// 		const { status, body } = AuthResponseFactory.getSuccessResponse(200, enabledMethods);
			
	// 		reply.code(status).send(body);
	// 	} catch (err: any) {
	// 		const { status, body } = AuthResponseFactory.getErrorResponse(err);
			
	// 		reply.code(status).send(body);
	// 	}
	// }

	// async disableMethodEndpoint(request: FastifyRequest, reply: FastifyReply) {
	// 	const user_id = request.user?.sub;
	// 	const { method } = request.params as { method: string };
		
	// 	try {
	// 		await this.twoFactorService.disableEnabledMethod(user_id!, method);
			
	// 		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
			
	// 		reply.code(status).send(body);
	// 	} catch (err: any) {
	// 		const { status, body } = AuthResponseFactory.getErrorResponse(err);
			
	// 		reply.code(status).send(body);
	// 	}
	// }

	/*---------------------------------------- TOTP (AUTH APP) ----------------------------------------*/
	
	async TOTPSetupInitEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		console.log('CALLING TOTPSetupInitEndpoint CONTROLLER');
		
		try {
			const secrets = await this.twoFactorService.setupTOTP(user_id!);
			
			const { status, body } = AuthResponseFactory.getSuccessResponse(200, secrets);
			
			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);
			
			reply.code(status).send(body);
		}
	}

	async TOTPSetupVerifyEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const { code } = request.body as IMFAVerifyRequest;
		const user_id = request.user?.sub;
		
		try {
			await this.twoFactorService.confirmTOTP(code, user_id!);
			
			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
			
			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);
			
			reply.code(status).send(body);
		}
	}

	async TOTPVerifyEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const { code } = request.body as IMFAVerifyRequest;
		const user_id = request.user?.sub;
		
		try {
			await this.twoFactorService.verifyTOTP(code, user_id!);
			
			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
			
			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);
			
			reply.code(status).send(body);
		}
	}


	/*------------------------------------------ OTP (EMAIL) ------------------------------------------*/
	
	async EmailOTPSetupInitEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		
		try {
			const email = 'mock-email@gmail.com';
			
			await this.twoFactorService.setupOTP('email', email, user_id!);
			
			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
			
			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);
			
			reply.code(status).send(body);
		}
	}

	async EmailOTPSetupVerifyEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const { code } = request.body as IMFAVerifyRequest;
		const user_id = request.user?.sub;
		
		try {
			await this.twoFactorService.confirmOTP('email', code, user_id!);
			
			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
			
			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);
			
			reply.code(status).send(body);
		}
	}

	async EmailOTPVerifyEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const { code } = request.body as IMFAVerifyRequest;
		const user_id = request.user?.sub;
		
		try {
			await this.twoFactorService.verifyOTP('email', code, user_id!);
			
			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
			
			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);
			
			reply.code(status).send(body);
		}
	}


	/*------------------------------------------ OTP (SMS) ------------------------------------------*/

	async SMSOTPSetupInitEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		const { phone } = request.body as { phone: string };
		
		try {
			await this.twoFactorService.setupOTP('sms', phone, user_id!);
			
			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
			
			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);
			
			reply.code(status).send(body);
		}
	}

	async SMSOTPSetupVerifyEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const { code } = request.body as IMFAVerifyRequest;
		const user_id = request.user?.sub;
		
		try {
			await this.twoFactorService.confirmOTP('sms', code, user_id!);
			
			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
			
			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);
			
			reply.code(status).send(body);
		}
	}

	async SMSOTPVerifyEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const { code } = request.body as IMFAVerifyRequest;
		const user_id = request.user?.sub;
		
		try {
			await this.twoFactorService.verifyOTP('sms', code, user_id!);
			
			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
			
			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);
			
			reply.code(status).send(body);
		}
	}

	// async TwoFactorSetupEndpoint(request: FastifyRequest, reply: FastifyReply) {
	// 	console.log(request.body);
	// 	const { method, contact } = request.body as I2FASetupRequest;
	// 	const user_id = request.user?.sub;
		
	// 	if (!method || !user_id || ((method === 'email' || method === 'sms') && !contact))
	// 		reply.status(400).send({ success: true, data: {} });
		
	// 	try {
	// 		if (method === 'totp') {
	// 			const secrets = await this.twoFactorService.setupTOTP(user_id!);
				
	// 			reply.status(201).send({ success: true, data: secrets });
	// 		} else if (method === 'email' || method === 'sms') {
	// 			await this.twoFactorService.setupOTP(method, contact, user_id!);
				
	// 			reply.status(201).send({ success: true, data: {} });
	// 		} else {
				
	// 			reply.status(400).send({ success: false, data: {} });
	// 		}

	// 		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

	// 	} catch (err: any) {
	// 		const { status, body } = AuthResponseFactory.getErrorResponse(err);

	// 		reply.code(status).send(body);
	// 	}
	// }

	// async TwoFactorConfirmEndpoint(request: FastifyRequest, reply: FastifyReply) {
	// 	console.log(request.body);
	// 	const { method, code } = request.body as I2FAConfirmRequest;
	// 	const user_id = request.user?.sub;

	// 	if (!method || !user_id || !code)
	// 		reply.status(400).send({ success: true, data: {} });

	// 	try {
	// 		if (method === 'totp') {
	// 			await this.twoFactorService.confirmTOTP(code, user_id!);

	// 			reply.status(201).send({ success: true, data: {} });
	// 		} else if (method === 'email' || method === 'sms') {
	// 			await this.twoFactorService.confirmOTP(code, method, user_id!);

	// 			reply.status(201).send({ success: true, data: {} });
	// 		} else {

	// 			reply.status(400).send({ success: true, data: {} });
	// 		}

	// 		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

	// 	} catch (err: any) {
	// 		const { status, body } = AuthResponseFactory.getErrorResponse(err);

	// 		reply.code(status).send(body);
	// 	}
	// }

	// async TwoFactorVerifyEndpoint(request: FastifyRequest, reply: FastifyReply) {
	// 	console.log(request.body);
	// 	const { method, code } = request.body as I2FAConfirmRequest;
	// 	const user_id = request.user?.sub;

	// 	if (!method || !user_id || !code)
	// 		reply.status(400).send({ success: true, data: {} });

	// 	try {
	// 		if (method === 'totp') {
	// 			await this.twoFactorService.verifyTOTP(code, user_id!);

	// 			reply.status(201).send({ success: true, data: {} });
	// 		} else if (method === 'email' || method === 'sms') {
	// 			await this.twoFactorService.verifyOTP(method, code, user_id!);

	// 			reply.status(201).send({ success: true, data: {} });
	// 		} else {

	// 			reply.status(400).send({ success: true, data: {} });
	// 		}

	// 		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

	// 	} catch (err: any) {
	// 		const { status, body } = AuthResponseFactory.getErrorResponse(err);

	// 		reply.code(status).send(body);
	// 	}
	// }

	// disable endpoint
}

export default MFAController;