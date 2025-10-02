import { FastifyReply, FastifyRequest } from "fastify";
import AuthService from "../services/Auth/authService";
import { ILoginRequest, IRegisterRequest } from "../types";
import { TokenRequiredError } from "../types/auth.types";
import TwoFactorService from "../services/TwoFactorAuth/[DEPRECATED]TwoFactorService";
import AuthResponseFactory from "./authResponseFactory";


class AuthController {
	constructor(
		private authService: AuthService
	) {}

	async registerHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { first_name, last_name, username, email, password } = request.body as IRegisterRequest;
			
			await this.authService.SignUp(first_name, last_name, username, email, password);

			const { status, body } = AuthResponseFactory.getSuccessResponse(201, {});
			
			return reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async loginHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { username, password } = request.body as ILoginRequest;
			const userAgent = request.headers["user-agent"] || '';

			const loginResult = await this.authService.LogIn(username, password, userAgent, request.ip);
			if (loginResult._2FARequired) {
				const { _2FARequired, enabled2FAMethods, loginChallengeID } = loginResult;
				
				const { status, body } = AuthResponseFactory.getSuccessResponse(200, { _2FARequired, enabled2FAMethods, loginChallengeID });

				return reply.code(status).send(body);
			}
			
			const { user, refreshToken, accessToken } = loginResult;

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { user, accessToken });

			return reply.code(status).setCookie(
				'refreshToken', refreshToken ?? '', { // TODO: CHECK REFRESH TOKEN TYPE ASSERTION
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax'
				}
			).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			if (!reply.sent)
				return reply.code(status).send(body);
		}
	}

	async sendTwoFAChallengeHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { loginChallengeID, method } = request.body as { loginChallengeID: number, method: 'TOTP' | 'SMS' | 'EMAIL' };
			const userAgent = request.headers["user-agent"] || '';

			await this.authService.sendTwoFAChallengeCode(loginChallengeID, method, userAgent, request.ip);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async verifyTwoFAChallengeHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { loginChallengeID, code } = request.body as { loginChallengeID: number, code: string };
			const userAgent = request.headers["user-agent"] || '';

			const { user, refreshToken, accessToken } = await this.authService.verifyTwoFAChallengeCode(loginChallengeID, code, userAgent, request.ip);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { user, accessToken });

			return reply.code(status).setCookie(
				'refreshToken', refreshToken ?? '', { // TODO: CHECK REFRESH TOKEN TYPE ASSERTION
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax'
				}
			).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async logoutHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const userAgent = request.headers["user-agent"] || '';
			const refresh_token = request.cookies?.['refreshToken']; // TODO: SHOULD BE IN FASTIFY SCHEMA
			if (!refresh_token)
				throw new TokenRequiredError();
			
			await this.authService.LogOut(refresh_token!, userAgent, request.ip);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
			
			return reply.code(status).setCookie(
				'refreshToken', '', {
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax',
					expires: new Date(0)
				}
			).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async refreshHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const userAgent = request.headers["user-agent"] || '';
			const oldRefreshToken = request.cookies?.['refreshToken']; // TODO: SHOULD BE IN FASTIFY SCHEMA
			if (!oldRefreshToken)
				throw new TokenRequiredError();
			
			const { user, newAccessToken: accessToken, newRefreshToken: refreshToken } 
				= await this.authService.Refresh(oldRefreshToken!, userAgent, request.ip);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { user, accessToken });

			return reply.code(status).setCookie(
				'refreshToken', refreshToken, {
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax'
				}
			).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).setCookie(
				'refreshToken', '', {
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax',
					expires: new Date(0)
				}
			).send(body);
		}
	}

	// async GoogleOAuthEndpoint(request: FastifyRequest, reply: FastifyReply) {
	// 	const { code } = request.query as IOAuthLoginRequest;

	// 	const userAgent = request.headers["user-agent"] || '';

	// 	try {
	// 		const { accessToken, refreshToken} = await this.authService.GoogleLogIn(code, userAgent, request.ip);

	// 		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

	// 		reply.redirect(`http://localhost:3000/login?access_token=${accessToken}&refresh_token=${refreshToken}`);
	// 	} catch (err: any) {
	// 		const { status, body } = AuthResponseFactory.getErrorResponse(err);

	// 		reply.code(status).send(body);
	// 	}
	// }

	// async IntraOAuthEndpoint(request: FastifyRequest, reply: FastifyReply) {
	// 	const { code } = request.query as IOAuthLoginRequest;

	// 	const userAgent = request.headers["user-agent"] || '';

	// 	try {
	// 		const { accessToken, refreshToken} = await this.authService.IntraLogIn(code, userAgent, request.ip);

	// 		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

	// 		reply.redirect(`http://localhost:3000/login?access_token=${accessToken}&refresh_token=${refreshToken}`);
	// 		// reply.code(200).send({ success: true, data });
	// 	} catch (err: any) {
	// 		const { status, body } = AuthResponseFactory.getErrorResponse(err);

	// 		reply.code(status).send(body);
	// 	}
	// }

	async changePasswordHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;
			const { oldPassword, newPassword } = request.body as { oldPassword: string, newPassword: string };

			await this.authService.changePassword(user_id!, oldPassword, newPassword);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}
}

export default AuthController;