import { FastifyReply, FastifyRequest } from "fastify";
import AuthService from "../services/Auth/AuthService";
import SessionsService from "../services/Auth/SessionsService";
import AuthResponseFactory from "./AuthResponseFactory";
import { ILoginRequest, IRegisterRequest } from "../types";
import { UUID } from "crypto";
import { AuthChallengeMethod } from "../repositories/AuthChallengesRepository";
import { JSONCodec } from "nats";
import { oauthConfig } from "../config/oauth";
import logger from "../utils/misc/logger";
import AuthError from "../types/exceptions/AAuthError";

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
		const result = await this.authService.LogIn(username, password, request.fingerprint!);

		if (result._2FARequired) {
			const { _2FARequired, enabled2FAMethods, token } = result;
			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { _2FARequired, enabled2FAMethods, token });
			return reply.code(status).send(body);
		}

		const { user, refreshToken, accessToken } = result;
		const { status, body } = AuthResponseFactory.getSuccessResponse(200, { user, accessToken });
		return reply.code(status).setCookie('refreshToken', refreshToken!, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict'
		}).send(body);
	}

	async sendTwoFAChallengeHandler(request: FastifyRequest, reply: FastifyReply) {
		const { token, method } = request.body as { token: string, method: AuthChallengeMethod };
		await this.authService.sendTwoFAChallengeCode(token as UUID, method, request.fingerprint!);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	async verifyTwoFAChallengeHandler(request: FastifyRequest, reply: FastifyReply) {
		const { token, code } = request.body as { token: string, code: string };
		const { user, refreshToken, accessToken } = await this.authService.verifyTwoFAChallengeCode(token as UUID, code, request.fingerprint!);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, { user, accessToken });
		return reply.code(status).setCookie('refreshToken', refreshToken, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict'
		}).send(body);
	}

	async resendTwoFAChallengeHandler(request: FastifyRequest, reply: FastifyReply) {
		const { token } = request.body as { token: string };
		await this.authService.resendTwoFAChallengeCode(token as UUID);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	async logoutHandler(request: FastifyRequest, reply: FastifyReply) {
		const { session_id, sub } = request.refreshTokenPayload!;
		await this.sessionsService.revokeSession(session_id!, sub!, "Logout requested by user");
		this.publishSessionRefreshRequiredToUser(sub!);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).setCookie('refreshToken', '', {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			expires: new Date(0)
		}).send(body);
	}

	async refreshHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { user, newAccessToken: accessToken, rotatedRefreshToken: refreshToken } = await this.authService.Refresh(request.refreshTokenPayload!, request.fingerprint!);
			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { user, accessToken });

			return reply.code(status).setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict'
			}).send(body);
		} catch (err) {
			reply.setCookie('refreshToken', '', {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: new Date(0)
			});
			throw err;
		}
	}

	async googleOAuthConsentRedirectHandler(request: FastifyRequest, reply: FastifyReply) {
		const { frontendOrigin } = request.query as { frontendOrigin: string };
		const frontendURL = new URL(frontendOrigin);
		const redirectURI = `${frontendURL.origin}/api/auth/google/callback`;
		const scope = ['openid', 'profile', 'email'];

		const consentURL = `${oauthConfig.google.auth_uri}?${new URLSearchParams({
			client_id: oauthConfig.google.client_id,
			redirect_uri: redirectURI,
			response_type: 'code',
			scope: scope.join(' '),
			access_type: 'offline',
			prompt: 'consent',
			state: frontendOrigin
		})}`;

		logger.trace({ consentURL, frontendOrigin }, '[OAUTH] Google Consent Redirect');
		return reply.redirect(consentURL);
	}

	async googleOAuthCallbackHandler(request: FastifyRequest, reply: FastifyReply) {
		const { code, state: frontendOrigin, error } = request.query as { code?: string, state?: string, error?: string };
		const redirectURI = `${new URL(frontendOrigin!).origin}/api/auth/google/callback`;

		logger.trace({ code, frontendOrigin, error }, '[OAUTH] Google Callback');

		if (error) return reply.redirect(`${frontendOrigin}?error=${encodeURIComponent(error)}`);

		try {
			const { refreshToken } = await this.authService.loginGoogleOAuth(code!, redirectURI, request.fingerprint!);
			return reply.setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict'
			}).redirect(`${frontendOrigin}`);
		} catch (err) {
			const errorCode = err instanceof AuthError ? err.errorCode : 'AUTH_OAUTH_FAILED';
			return reply.redirect(`${frontendOrigin}?error=${encodeURIComponent(errorCode)}`);
		}
	}

	async intra42OAuthConsentRedirectHandler(request: FastifyRequest, reply: FastifyReply) {
		const { frontendOrigin } = request.query as { frontendOrigin: string };
		const redirectURI = `${new URL(frontendOrigin).origin}/api/auth/42/callback`;

		const consentURL = `${oauthConfig.intra42.auth_uri}?${new URLSearchParams({
			client_id: oauthConfig.intra42.client_id,
			redirect_uri: redirectURI,
			response_type: 'code',
			scope: 'public',
			state: frontendOrigin
		})}`;

		logger.trace({ consentURL, frontendOrigin }, '[OAUTH] 42 Consent Redirect');
		return reply.redirect(consentURL);
	}

	async intra42OAuthCallbackHandler(request: FastifyRequest, reply: FastifyReply) {
		const { code, state: frontendOrigin, error } = request.query as { code?: string, state?: string, error?: string };
		const redirectURI = `${new URL(frontendOrigin!).origin}/api/auth/42/callback`;

		logger.trace({ code, frontendOrigin, error }, '[OAUTH] 42 Callback');

		if (error) return reply.redirect(`${frontendOrigin}?error=${encodeURIComponent(error)}`);

		try {
			const { refreshToken } = await this.authService.loginIntra42(code!, redirectURI, request.fingerprint!);
			return reply.setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict'
			}).redirect(`${frontendOrigin}`);
		} catch (err) {
			const errorCode = err instanceof AuthError ? err.errorCode : 'AUTH_OAUTH_FAILED';
			return reply.redirect(`${frontendOrigin}?error=${encodeURIComponent(errorCode)}`);
		}
	}

	async fetchSessionsHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub!;
		const sessions = await this.sessionsService.getActiveSessions(user_id, request.refreshTokenPayload!.session_id);
		const { status, body } = AuthResponseFactory.getSuccessResponse(200, sessions);
		return reply.code(status).send(body);
	}

	async revokeSessionHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub!;
		const { session_id } = request.params as { session_id: string };

		await this.sessionsService.revokeSession(session_id, user_id, "Revokation requested by user");
		this.publishSessionRefreshRequiredToUser(user_id);

		if (session_id === request.refreshTokenPayload!.session_id) {
			reply.setCookie('refreshToken', '', {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: new Date(0)
			});
		}

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	async revokeMassSessionsHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub!;
		await this.sessionsService.revokeMassSessions(user_id, "Mass revokation requested by user", request.refreshTokenPayload!.session_id);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	async changePasswordHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub!;
		const { oldPassword, newPassword } = request.body as { oldPassword: string, newPassword: string };
		logger.debug({ body: request.body }, '[changePasswordHandler]');

		await this.authService.changePassword(user_id, oldPassword, newPassword);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	private publishSessionRefreshRequiredToUser(userId: number) {
		if (!this.nats || !this.js) return;

		const codec = JSONCodec();
		this.nats.publish('gateway.user.session', codec.encode({
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
