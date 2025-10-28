import fastify, { FastifyReply, FastifyRequest } from "fastify";
import AuthService from "../services/Auth/AuthService";
import { ILoginRequest, IRegisterRequest } from "../types";
import AuthResponseFactory from "./AuthResponseFactory";
import SessionsService from "../services/Auth/SessionsService";
import { UUID } from "crypto";
import { AuthChallengeMethod } from "../repositories/AuthChallengesRepository";
import { JSONCodec } from "nats";
import logger from "../utils/misc/logger";


class AuthController {
	constructor(
		private authService: AuthService,
		private sessionsService: SessionsService,
		private nats: any,
		private js: any
	) {}

	async registerHandler(request: FastifyRequest, reply: FastifyReply) {
		const { first_name, last_name, username, email, password } = request.body as IRegisterRequest;

		await this.authService.SignUp(first_name, last_name, username, email, password);

		const { status, body } = AuthResponseFactory.getSuccessResponse(201, {});

		return reply.code(status).send(body);
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
		const { token, method } = request.body as { token: string, method: AuthChallengeMethod };

		await this.authService.sendTwoFAChallengeCode(
			token as UUID,
			method,
			request.fingerprint!
		);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	async verifyTwoFAChallengeHandler(request: FastifyRequest, reply: FastifyReply) {
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
	}

	async resendTwoFAChallengeHandler(request: FastifyRequest, reply: FastifyReply) {
		const { token } = request.body as { token: string };

		await this.authService.resendTwoFAChallengeCode(token as UUID);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	async logoutHandler(request: FastifyRequest, reply: FastifyReply) {
		// await this.authService.LogOut(request.refreshTokenPayload!);
		await this.sessionsService.revokeSession(
			request.refreshTokenPayload!.session_id!,
			request.refreshTokenPayload!.sub!,
			`Logout requested by user`
		); this.publishRefreshRequiredToUser(request.refreshTokenPayload!.sub!);

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
	}

	async refreshHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { user, newAccessToken: accessToken, rotatedRefreshToken: refreshToken }
				= await this.authService.Refresh(request.refreshTokenPayload!, request.fingerprint!);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { user, accessToken });
			return reply.code(status).setCookie(
				'refreshToken', refreshToken, {
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax'
				}
			).send(body);
		} catch (err) {
			reply.setCookie(
				'refreshToken', '', {
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax',
					expires: new Date(0)
				}
			); throw err;
		}
	}

	async googleOAuthCallbackHandler(request: FastifyRequest, reply: FastifyReply) {
		const { code, state: frontendOrigin } = request.query as { code: string, state: string }; // TODO: ADD SCHEMA

		console.log({ frontendOrigin }, '[OAUTH] GoogleOAuthConsent Callback Handler');

		const { user, accessToken, refreshToken } = await this.authService.loginGoogleOAuth(code, request.fingerprint!);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.setCookie(
			'refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'lax'
			}
		).redirect(`${frontendOrigin}`);
	}

	async intra42OAuthCallbackHandler(request: FastifyRequest, reply: FastifyReply) {
		const { code } = request.query as { code: string }; // TODO: ADD SCHEMA

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
	}

	async fetchSessionsHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;

		const sessions = await this.sessionsService.getActiveSessions(
			user_id!,
			request.refreshTokenPayload!.session_id
		);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, sessions);
		return reply.code(status).send(body);
	}

	async revokeSessionHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		const { session_id } = request.params as { session_id: string };

		await this.sessionsService.revokeSession(
			session_id,
			user_id!,
			`Revokation requested by user`
		); this.publishRefreshRequiredToUser(user_id!);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		if (session_id! === request.refreshTokenPayload!.session_id) {
			reply.setCookie(
				'refreshToken', '', {
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax',
					expires: new Date(0)
				}
			);
		}
		return reply.code(status).send(body);
	}

	async revokeMassSessionsHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;

		await this.sessionsService.revokeMassSessions(
			user_id!,
			'Mass revokation requested by user',
			request.refreshTokenPayload!.session_id
		);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	async changePasswordHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		const { oldPassword, newPassword } = request.body as { oldPassword: string, newPassword: string };
		logger.debug({ body: request.body }, '[changePasswordHandler]');

		await this.authService.changePassword(user_id!, oldPassword, newPassword);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	private publishRefreshRequiredToUser(userId: number) {
		const _JSONCodec = JSONCodec();
		this.nats.publish('gateway.user.session', _JSONCodec.encode({
			eventType: 'SESSION_UPDATE',
			recipientUserIds: [userId],
			data: {
				requesterId: userId,
				receiverId: userId,
				status: 'REFRESH_REQUIRED'
			}
		}));
	}
}

export default AuthController;
