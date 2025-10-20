import { FastifyReply, FastifyRequest } from "fastify";
import AuthService from "../services/Auth/AuthService";
import { ILoginRequest, IRegisterRequest } from "../types";
import AuthResponseFactory from "./AuthResponseFactory";
import SessionsService from "../services/Auth/SessionsService";
import { UUID } from "crypto";
import { TokenRequiredError } from "../types/exceptions/auth.exceptions";
import { AuthChallengeMethod } from "../repositories/AuthChallengesRepository";


class AuthController {
	constructor(
		private authService: AuthService,
		private sessionsService: SessionsService
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
		const { username, password } = request.body as ILoginRequest;

		const loginResult = await this.authService.LogIn(username, password, request.fingerprint!);
		if (loginResult._2FARequired) {
			const { _2FARequired, enabled2FAMethods, token } = loginResult;

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { _2FARequired, enabled2FAMethods, token });
			return reply.code(status).send(body);
		}

		const { user, refreshToken, accessToken } = loginResult;

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, { user, accessToken });
		return reply.code(status).setCookie(
			'refreshToken', refreshToken!, {
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'lax'
			}
		).send(body);
	}

	async sendTwoFAChallengeHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { token, method } = request.body as { token: string, method: AuthChallengeMethod };

			await this.authService.sendTwoFAChallengeCode(
				token as UUID,
				method,
				request.fingerprint!
			);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async verifyTwoFAChallengeHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { token, code } = request.body as { token: string, code: string };

			const { user, refreshToken, accessToken } = await this.authService.verifyTwoFAChallengeCode(
				token as UUID,
				code,
				request.fingerprint!
			);

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

			return reply.code(status).send(body);
		}
	}

	async resendTwoFAChallengeHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { token } = request.body as { token: string };

			await this.authService.resendTwoFAChallengeCode(token as UUID);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async logoutHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const refresh_token = request.cookies?.['refreshToken'];
			if (!refresh_token)
				throw new TokenRequiredError();

			await this.authService.LogOut(refresh_token!);

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
			const oldRefreshToken = request.cookies?.['refreshToken'];
			if (!oldRefreshToken)
				throw new TokenRequiredError();

			const { user, newAccessToken: accessToken, newRefreshToken: refreshToken }
				= await this.authService.Refresh(oldRefreshToken!, request.fingerprint!);

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

	async googleOAuthCallbackHandler(request: FastifyRequest, reply: FastifyReply) {
		const { code } = request.query as { code: string }; // TODO: ADD SCHEMA

		console.log('google oauth code: ', code);

		try {
			const { user, accessToken, refreshToken } = await this.authService.loginGoogleOAuth(code, request.fingerprint!);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.setCookie(
				'refreshToken', refreshToken, {
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax'
				}
			).redirect(`${process.env['FRONTEND_URL']}`);
			// reply.redirect(`http://localhost:3000/login?access_token=${accessToken}&refresh_token=${refreshToken}`);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async intra42OAuthCallbackHandler(request: FastifyRequest, reply: FastifyReply) {
		const { code } = request.query as { code: string }; // TODO: ADD SCHEMA

		try {
			const { user, accessToken, refreshToken } = await this.authService.loginIntra42(code, request.fingerprint!);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.setCookie(
				'refreshToken', refreshToken, {
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax'
				}
			).redirect(`${process.env['FRONTEND_URL']}`);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

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

	async getActiveSessionsHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;
			const refresh_token = request.cookies?.['refreshToken'];

			const sessions = await this.sessionsService.getActiveSessions(user_id!, refresh_token || undefined);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, sessions);

			return reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async revokeSessionHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;
			const { id } = request.params as { id: string };

			await this.sessionsService.revokeSession(id, `Revoked by session owner`, user_id!);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async revokeAllSessionsHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;
			const refresh_token = request.cookies?.['refreshToken'];

			await this.sessionsService.revokeAllSessions(`Revoked by session owner (Mass Revokation)`, user_id!, refresh_token || undefined);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

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
