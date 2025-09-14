import { FastifyReply, FastifyRequest } from "fastify";
import AuthService, { AuthServiceConfig } from "../services/authService";
import { CreateUserRequest, ErrorResponse, I2FAConfirmRequest, I2FASetupRequest, ILoginRequest, ILogoutRequest, IOAuthLoginRequest, IRegisterRequest, IResetPasswordRequest, IResetPasswordUpdateRequest, IResetPasswordVerifyRequest } from "../types";
import bcrypt from 'bcrypt';
import AuthErrorHandler from "./authResponseFactory";
import { TokenRequiredError } from "../types/auth.types";
import TwoFactorService from "../services/twoFactorService";
import ResetPasswordService from "../services/passwordResetService";
import AuthResponseFactory from "./authResponseFactory";

const DEFAULT_BCRYPT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const SESSION_HARD_EXPIRY = '30d';
const MAX_CONCURRENT_SESSIONS = 4;
const MAX_SESSION_FINGERPRINT_CHANGE = 1;
const BCRYPT_TIMING_HASH = bcrypt.hashSync('xuotjds;glsgf34%(#1fjkfdsfdsklnkcldsaf', 12);

export const authenticationConfig: AuthServiceConfig = {
	bcryptRounds: DEFAULT_BCRYPT_ROUNDS,
	bcryptDummyHash: BCRYPT_TIMING_HASH,
	accessTokenExpiry: ACCESS_TOKEN_EXPIRY,
	refreshTokenExpiry: REFRESH_TOKEN_EXPIRY,
	sessionHardExpiry: SESSION_HARD_EXPIRY,
	allowIpChange: true,
	allowBrowserChange: false,
	allowDeviceChange: false,
	maxConcurrentSessions: MAX_CONCURRENT_SESSIONS,
	maxSessionFingerprintChange: MAX_SESSION_FINGERPRINT_CHANGE
}

class AuthController {
	constructor(
		private authService: AuthService,
		private twoFactorService: TwoFactorService,
		// private resetService: ResetPasswordService
	) {}

	// REGISTER (NO-AUTO-LOGIN): REGISTERS USER IN DB
	async RegisterEndpoint(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { first_name, last_name, username, email, password } = request.body as IRegisterRequest;
			
			await this.authService.SignUp(first_name, last_name, username, email, password);

			const { status, body } = AuthResponseFactory.getSuccessResponse(201, {});
			
			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}
	
	// LOGIN: GENERATES ACCESS / REFRESH TOKENS
	async LoginEndpoint(request: FastifyRequest, reply: FastifyReply) {
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

			reply.code(status).setCookie(
				'refreshToken', refreshToken ?? '', { // TODO: CHECK REFRESH TOKEN TYPE ASSERTION
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax'
				}
			).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async SendLoginChallenge2FACodeEndpoint(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { loginChallengeID, method } = request.body as { loginChallengeID: number, method: string };
			const userAgent = request.headers["user-agent"] || '';

			await this.authService.sendLoginChallenge2FACode(loginChallengeID, method, userAgent, request.ip);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async VerifyLoginChallenge2FACodeEndpoint(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { loginChallengeID, method, code } = request.body as { loginChallengeID: number, method: string, code: string };
			const userAgent = request.headers["user-agent"] || '';

			const { user, refreshToken, accessToken } = await this.authService.verifyLoginChallenge2FACode(loginChallengeID, method, code, userAgent, request.ip);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { user, accessToken });

			reply.code(status).setCookie(
				'refreshToken', refreshToken ?? '', { // TODO: CHECK REFRESH TOKEN TYPE ASSERTION
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax'
				}
			).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	// LOGOUT
	async LogoutEndpoint(request: FastifyRequest, reply: FastifyReply) {
		try {
			const userAgent = request.headers["user-agent"] || '';
			const refresh_token = request.cookies?.['refreshToken']; // TODO: SHOULD BE IN FASTIFY SCHEMA
			if (!refresh_token)
				throw new TokenRequiredError();
			
			await this.authService.LogOut(refresh_token!, userAgent, request.ip);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
			
			reply.code(status).setCookie(
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

			reply.code(status).send(body);
		}
	}
	
	// REFRESH: GENERATES ACCESS / REFRESH TOKENS
	async RefreshEndpoint(request: FastifyRequest, reply: FastifyReply) {
		try {
			const userAgent = request.headers["user-agent"] || '';
			const oldRefreshToken = request.cookies?.['refreshToken']; // TODO: SHOULD BE IN FASTIFY SCHEMA
			if (!oldRefreshToken)
				throw new TokenRequiredError();
			
			const { user, newAccessToken: accessToken, newRefreshToken: refreshToken } 
				= await this.authService.Refresh(oldRefreshToken!, userAgent, request.ip);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { user, accessToken });

			reply.code(status).setCookie(
				'refreshToken', refreshToken, {
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax'
				}
			).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).setCookie(
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

	async changePasswordEndpoint(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;
			const { old_password, new_password } = request.body as { old_password: string, new_password: string };

			await this.authService.changePassword(user_id!, old_password, new_password);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	// async fetchMeEndpoint(request: FastifyRequest, reply: FastifyReply) {
	// 	try {
	// 		const user = await this.authService.fetchMe(request.user!.sub);

	// 		const { status, body } = AuthResponseFactory.getSuccessResponse(200, { user });

	// 		reply.code(status).send(body);
	// 	} catch (err: any) {
	// 		const { status, body } = AuthResponseFactory.getErrorResponse(err);

	// 		reply.code(status).send(body);
	// 	}
	// }
}

export default AuthController;