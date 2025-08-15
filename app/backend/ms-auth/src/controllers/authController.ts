import { FastifyReply, FastifyRequest } from "fastify";
import AuthService, { AuthConfig } from "../services/authService";
import { CreateUserRequest, ErrorResponse, I2FAConfirmRequest, I2FASetupRequest, ILoginRequest, ILogoutRequest, IOAuthLoginRequest, IRegisterRequest, IResetPasswordRequest, IResetPasswordUpdateRequest, IResetPasswordVerifyRequest } from "../types";
import bcrypt from 'bcrypt';
import AuthErrorHandler from "./authResponseFactory";
import { TokenRequiredError } from "../types/auth.types";
import TwoFactorService from "../services/twoFactorService";
import ResetPasswordService from "../services/resetService";
import AuthResponseFactory from "./authResponseFactory";

const DEFAULT_BCRYPT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const SESSION_HARD_EXPIRY = '30d';
const MAX_CONCURRENT_SESSIONS = 4;
const MAX_SESSION_FINGERPRINT_CHANGE = 1;
const BCRYPT_TIMING_HASH = bcrypt.hashSync('xuotjds;glsgf34%(#1fjkfdsfdsklnkcldsaf', 12);

export const authenticationConfig: AuthConfig = {
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
	private authService: AuthService;
	private twoFactorService: TwoFactorService;
	private resetService: ResetPasswordService;

	constructor() {
		this.authService = new AuthService(authenticationConfig);
		this.twoFactorService = new TwoFactorService();
		this.resetService = new ResetPasswordService();
	}

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
			
			const { user, refreshToken, accessToken, enabled_methods, session_id } 
				= await this.authService.LogIn(username, password, userAgent, request.ip);
			
			const _2FARequired = enabled_methods && enabled_methods.length > 0;

			if (_2FARequired) {
				const { status, body } = AuthResponseFactory.getSuccessResponse(206, { session_id, enabled_methods });
				reply.code(status).send(body);
			}
			
			// const enabledMethods = await this.twoFactorService.getEnabledMethods()
			
			// const _2faEnabled = true;
			// const enabledMethods = ['totp', 'sms'];

			// if (_2faEnabled) {
			// 	const { status, body } = AuthResponseFactory.getSuccessResponse(200, {
			// 		session_token: '123456789xyz',
			// 		enabled_methods: enabledMethods,
			// 	});
			// 	return reply.code(status).send(body);
			// }

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

			reply.code(status).send(body);
		}
	}

	// LOGOUT
	async LogoutEndpoint(request: FastifyRequest, reply: FastifyReply) {
		try {
			const userAgent = request.headers["user-agent"] || '';
			// const { access_token } = request.body as ILogoutRequest;
			const refresh_token = request.cookies?.['refreshToken'];
			// console.log('cookies: ', request.cookies);
			
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
			const oldRefreshToken = request.cookies?.['refreshToken'];
			if (!oldRefreshToken)
				throw new TokenRequiredError();
			console.log('======================================================================================================================================================================================================');
			console.log('refreshToken', oldRefreshToken);
			
			const { newAccessToken: accessToken, newRefreshToken: refreshToken } = await this.authService.Refresh(oldRefreshToken!, userAgent, request.ip);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { accessToken });

			reply.code(status).setCookie(
				'refreshToken', refreshToken, {
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax'
				}
			).send(body);
			// reply.code(200).send({ success: true, data: { accessToken, refreshToken } });
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
			// reply.code(status).send(body);
		}
	}

	async GoogleOAuthEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const { code } = request.query as IOAuthLoginRequest;

		const userAgent = request.headers["user-agent"] || '';

		try {
			const { accessToken, refreshToken} = await this.authService.GoogleLogIn(code, userAgent, request.ip);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			reply.redirect(`http://localhost:3000/login?access_token=${accessToken}&refresh_token=${refreshToken}`);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async IntraOAuthEndpoint(request: FastifyRequest, reply: FastifyReply) {
		const { code } = request.query as IOAuthLoginRequest;

		const userAgent = request.headers["user-agent"] || '';

		try {
			const { accessToken, refreshToken} = await this.authService.IntraLogIn(code, userAgent, request.ip);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			reply.redirect(`http://localhost:3000/login?access_token=${accessToken}&refresh_token=${refreshToken}`);
			// reply.code(200).send({ success: true, data });
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async changePasswordEndpoint(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;
			const { old_password, new_password } = request.body as { old_password: string, new_password: string};

			await this.authService.changePassword(user_id!, old_password, new_password);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async fetchMeEndpoint(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user = await this.authService.fetchMe(request.user!.sub);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, { user });

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}
}

export default AuthController;