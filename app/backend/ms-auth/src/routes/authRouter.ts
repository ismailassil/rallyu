import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import AuthController from "../controllers/authController";
import Authenticate from "../middleware/Authenticate";
import { authLoginSchema, authLogoutSchema, authMFAVerifySchema, authOAuthSchema, authRefreshSchema, authRegisterSchema, authResetPasswordSchema, authResetPasswordUpdateSchema, authResetPasswordVerifySchema } from "../schemas/auth.schema";
import bcrypt from 'bcrypt';
import cookie from '@fastify/cookie';
import { db } from "../database";
import MFAController from "../controllers/mfaController";
import ResetController from "../controllers/passwordResetController";
import AuthService, { AuthServiceConfig } from "../services/authService";
import UserService from "../services/userService";
import RelationsService from "../services/relationsService";
import RelationsRepository from "../repositories/relationsRepository";
import StatsService from "../services/statsService";
import UserRepository from "../repositories/userRepository";
import SessionService from "../services/sessionService";
import TwoFactorService from "../services/twoFactorService";
import ResetPasswordService from "../services/passwordResetService";
import TwoFactorRepository from "../repositories/twoFactorRepository";
import SessionRepository from "../repositories/sessionRepository";
import JWTUtils from "../utils/auth/Auth";
import TwoFactorController from "../controllers/twoFactorController";

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

async function authRouter(fastify: FastifyInstance) {
	const _JWTUtils = new JWTUtils();

	const userRepository = new UserRepository();
	const relationsRepository = new RelationsRepository();
	const twoFactorRepository = new TwoFactorRepository();
	const sessionRepository = new SessionRepository();

	const relationsService = new RelationsService(relationsRepository);
	const statsService = new StatsService();
	const userService = new UserService(userRepository, relationsService, statsService);
	const sessionService = new SessionService(authenticationConfig, _JWTUtils, sessionRepository);
	const twoFactorService = new TwoFactorService(twoFactorRepository);
	// const resetService = new ResetPasswordService();

	const authService = new AuthService(authenticationConfig, _JWTUtils, userService, sessionService, twoFactorService);
	const authController = new AuthController(authService, twoFactorService);
	const twoFactorController = new TwoFactorController(twoFactorService);
	// const mfaController: MFAController = new MFAController();
	// const resetController: ResetController = new ResetController();

	fastify.decorate('authenticate', Authenticate); // auth middleware for protected routes
	fastify.decorate('requireAuth', { preHandler: fastify.authenticate }); // preHandler hook
	fastify.decorateRequest('user', null);
	fastify.register(cookie);

	/*-------------------------------- Local Authentication --------------------------------*/
	fastify.post('/register', {
		schema: authRegisterSchema,
		handler: authController.RegisterEndpoint.bind(authController)
	});
	
	fastify.post('/login', {
		schema: authLoginSchema,
		handler: authController.LoginEndpoint.bind(authController)
	});
	
	fastify.post('/logout', {
		schema: authLogoutSchema,
		preHandler: fastify.authenticate,
		handler: authController.LogoutEndpoint.bind(authController)
	});
	
	fastify.get('/refresh', {
		schema: authRefreshSchema,
		handler: authController.RefreshEndpoint.bind(authController)
	});


	/*-------------------------------- Remote Authentication --------------------------------*/
	// fastify.get('/google/callback', {
	// 	schema: authOAuthSchema,
	// 	handler: authController.GoogleOAuthEndpoint.bind(authController)
	// });
	// fastify.get('/42/callback', {
	// 	schema: authOAuthSchema,
	// 	handler: authController.IntraOAuthEndpoint.bind(authController)
	// });


	/*----------------------------- Multi-Factor Authentication -----------------------------*/

	fastify.post('/login/2fa/send', {
		// TODO: ADD SCHEMA
		// schema: authLoginSchema,
		handler: authController.SendLoginChallenge2FACodeEndpoint.bind(authController)
	});

	fastify.post('/login/2fa/verify', {
		// TODO: ADD SCHEMA
		// schema: authLoginSchema,
		handler: authController.VerifyLoginChallenge2FACodeEndpoint.bind(authController)
	});

	fastify.get('/2fa/enabled', {
		// TODO: ADD SCHEMA
		// schema: auth2FASetupSchema,
		preHandler: fastify.authenticate,
		handler: twoFactorController.EnabledMethodsEndpoint.bind(twoFactorController)
	});

	// TODO: ADD ENDPOINTS FOR DELETING ENABLED METHODS

	fastify.post('/2fa/:method/setup/init', {
		// TODO: ADD SCHEMA
		// schema: auth2FASetupSchema,
		preHandler: fastify.authenticate,
		handler: twoFactorController.SetupInitEndpoint.bind(twoFactorController)
	});

	fastify.post('/2fa/:method/setup/verify', {
		// TODO: ADD SCHEMA
		// schema: auth2FASetupSchema,
		preHandler: fastify.authenticate,
		handler: twoFactorController.SetupVerifyEndpoint.bind(twoFactorController)
	});

	// fastify.post('/mfa/send-code', {
	// 	// schema: auth2FASetupSchema,
	// 	// preHandler: fastify.authenticate,
	// 	handler: mfaController.Send2FALoginCode.bind(mfaController)
	// });
	// fastify.post('/mfa/login', {
	// 	// schema: auth2FASetupSchema,
	// 	// preHandler: fastify.authenticate,
	// 	handler: mfaController.Verify2FALogin.bind(mfaController)
	// });

	// fastify.get('/mfa/enabled', {
	// 	// schema: auth2FASetupSchema,
	// 	preHandler: fastify.authenticate,
	// 	handler: mfaController.getEnabledMethodsEndpoint.bind(mfaController)
	// });
	// fastify.delete('/mfa/enabled/:method', {
	// 	// schema: auth2FASetupSchema,
	// 	preHandler: fastify.authenticate,
	// 	handler: mfaController.disableMethodEndpoint.bind(mfaController)
	// });

	// fastify.post('/mfa/totp/setup/init', {
	// 	// schema: auth2FASetupSchema,
	// 	preHandler: fastify.authenticate,
	// 	handler: mfaController.TOTPSetupInitEndpoint.bind(mfaController)
	// });
	// fastify.post('/mfa/totp/setup/verify', {
	// 	schema: authMFAVerifySchema,
	// 	preHandler: fastify.authenticate,
	// 	handler: mfaController.TOTPSetupVerifyEndpoint.bind(mfaController)
	// });

	// fastify.post('/mfa/email/setup/init', {
	// 	// schema: auth2FASetupSchema,
	// 	preHandler: fastify.authenticate,
	// 	handler: mfaController.EmailOTPSetupInitEndpoint.bind(mfaController)
	// });
	// fastify.post('/mfa/email/setup/verify', {
	// 	// schema: auth2FASetupSchema,
	// 	preHandler: fastify.authenticate,
	// 	handler: mfaController.EmailOTPSetupVerifyEndpoint.bind(mfaController)
	// });

	// fastify.post('/mfa/sms/setup/init', {
	// 	// schema: auth2FASetupSchema,
	// 	preHandler: fastify.authenticate,
	// 	handler: mfaController.SMSOTPSetupInitEndpoint.bind(mfaController)
	// });
	// fastify.post('/mfa/sms/setup/verify', {
	// 	// schema: auth2FASetupSchema,
	// 	preHandler: fastify.authenticate,
	// 	handler: mfaController.SMSOTPSetupVerifyEndpoint.bind(mfaController)
	// });

	// fastify.post('/2fa/confirm', {
	// 	schema: auth2FAConfirmSchema,
	// 	preHandler: fastify.authenticate,
	// 	handler: mfaController.TwoFactorConfirmEndpoint.bind(mfaController)
	// });
	// fastify.post('/2fa/verify', {
	// 	schema: auth2FAVerifySchema,
	// 	preHandler: fastify.authenticate,
	// 	handler: mfaController.TwoFactorVerifyEndpoint.bind(mfaController)
	// });
	// fastify.post('/2fa/disable', {
	// 	schema: auth2FADisableSchema,
	// 	preHandler: fastify.authenticate,
	// 	handler: mfaController.TwoFactorVerifyEndpoint.bind(mfaController)
	// });
	

	/*------------------------------------ Password Management ------------------------------------*/

	fastify.post('/change-password', {
		preHandler: fastify.authenticate,
		// schema: authResetPasswordSchema,
		handler: authController.changePasswordEndpoint.bind(authController)
	});

	// fastify.post('/reset/setup', {
	// 	schema: authResetPasswordSchema,
	// 	handler: resetController.ResetPasswordSetupEndpoint.bind(resetController)
	// });

	// fastify.post('/reset/verify', {
	// 	schema: authResetPasswordVerifySchema,
	// 	handler: resetController.ResetPasswordVerifyEndpoint.bind(resetController)
	// });

	// fastify.post('/reset/update', {
	// 	schema: authResetPasswordUpdateSchema,
	// 	handler: resetController.ResetPasswordUpdateEndpoint.bind(resetController)
	// });

	// fastify.delete('/revoke-all', authController.RevokeAllRoute.bind(authController));

	// SESSION / DEVICE MANAGEMENT
	// GET /auth/sessions — List active sessions/devices
	// DELETE /auth/sessions/:id — Revoke a specific session
	// DELETE /auth/sessions — Revoke all sessions except current

	// PASSWORD MANAGEMENT
	// POST /auth/forgot-password — Send password reset link
	// POST /auth/reset-password — Reset password with token
	// POST /auth/change-password — Authenticated user changes own password

	// EMAIL VERIFICATION (optional)
	// POST /auth/verify-email — Trigger email verification
	// GET /auth/verify-email/:token — Confirm email with token
}

export default authRouter;