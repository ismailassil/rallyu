import { FastifyInstance } from "fastify";
import AuthController from "../controllers/authController";
import Authenticate from "../middleware/Authenticate";
import { zodFormValidator } from "../utils/validation/zodFormValidator";
import cookie from '@fastify/cookie';
import TwoFactorController from "../controllers/twoFactorController";
import PasswordResetController from "../controllers/passwordResetController";
import { 
	auth2FADisableSchema,
	auth2FALoginChallengeSchema, 
	auth2FALoginChallengeVerifyCodeSchema, 
	auth2FASetupSchema, 
	auth2FASetupVerifySchema, 
	authChangePasswordSchema, 
	authLoginSchema, 
	authOAuthSchema, 
	authRegisterSchema, 
	authResetPasswordSchema, 
	authResetPasswordUpdateSchema, 
	authResetPasswordVerifySchema 
} from "../schemas/auth.schema";
import { 
	zodLoginSchema, 
	zodRegisterSchema, 
	zodChangePasswordSchema, 
	zodResetPasswordSchema, 
	zodResetPasswordUpdateSchema, 
	zodResetPasswordVerifySchema, 
	zodTwoFactorLoginChallengeSchema, 
	zodTwoFactorLoginChallengeVerifyCodeSchema,
	zodTwoFactorSetupSchema, 
	zodTwoFactorSetupVerifySchema
} from "../schemas/zod/auth.zod.schema";

async function authRouter(fastify: FastifyInstance, opts: {
	authController: AuthController,
	twoFactorController: TwoFactorController,
	passwordResetController: PasswordResetController
}) {
	fastify.decorate('authenticate', Authenticate); // auth middleware for protected routes
	fastify.decorate('requireAuth', { preHandler: fastify.authenticate }); // preHandler hook
	fastify.decorateRequest('user', null);
	fastify.register(cookie);



	/*-------------------------------- Local Authentication --------------------------------*/
	fastify.post('/register', {
		schema: authRegisterSchema,
		...zodFormValidator(zodRegisterSchema),
		handler: opts.authController.registerHandler.bind(opts.authController)
	});
	
	fastify.post('/login', {
		schema: authLoginSchema,
		...zodFormValidator(zodLoginSchema),
		handler: opts.authController.loginHandler.bind(opts.authController)
	});
	
	fastify.post('/logout', {
		// preHandler: fastify.authenticate,
		handler: opts.authController.logoutHandler.bind(opts.authController)
	});
	
	fastify.get('/refresh', {
		handler: opts.authController.refreshHandler.bind(opts.authController)
	});


	/*---------------------------------------- OAuth ----------------------------------------*/
	// fastify.get('/google/callback', {
	// 	schema: authOAuthSchema,
	// 	handler: opts.authController.GoogleOAuthEndpoint.bind(opts.authController)
	// });
	// fastify.get('/42/callback', {
	// 	schema: authOAuthSchema,
	// 	handler: opts.authController.IntraOAuthEndpoint.bind(opts.authController)
	// });



	/*----------------------------- Multi-Factor Authentication -----------------------------*/
	fastify.post('/login/2fa/send', {
		schema: auth2FALoginChallengeSchema,
		...zodFormValidator(zodTwoFactorLoginChallengeSchema),
		handler: opts.authController.sendTwoFAChallengeHandler.bind(opts.authController)
	});

	fastify.post('/login/2fa/verify', {
		schema: auth2FALoginChallengeVerifyCodeSchema,
		...zodFormValidator(zodTwoFactorLoginChallengeVerifyCodeSchema),
		handler: opts.authController.verifyTwoFAChallengeHandler.bind(opts.authController)
	});

	fastify.get('/2fa/enabled', {
		preHandler: fastify.authenticate,
		handler: opts.twoFactorController.fetchEnabledMethodsHandler.bind(opts.twoFactorController)
	});

	fastify.delete('/2fa/enabled/:method', {
		schema: auth2FADisableSchema,
		preHandler: fastify.authenticate,
		handler: opts.twoFactorController.disableMethodHandler.bind(opts.twoFactorController)
	});

	fastify.post('/2fa/:method/setup/init', {
		schema: auth2FASetupSchema,
		preHandler: fastify.authenticate,
		handler: opts.twoFactorController.setupInitHandler.bind(opts.twoFactorController)
	});
	
	fastify.post('/2fa/:method/setup/verify', {
		schema: auth2FASetupVerifySchema,
		preHandler: fastify.authenticate,
		handler: opts.twoFactorController.setupVerifyHandler.bind(opts.twoFactorController)
	});



	/*------------------------------------ Password Management ------------------------------------*/
	fastify.post('/change-password', {
		schema: authChangePasswordSchema,
		...zodFormValidator(zodChangePasswordSchema),
		preHandler: fastify.authenticate,
		handler: opts.authController.changePasswordHandler.bind(opts.authController)
	});
	
	fastify.post('/reset-password', {
		schema: authResetPasswordSchema,
		...zodFormValidator(zodResetPasswordSchema),
		handler: opts.passwordResetController.resetPasswordSetupHandler.bind(opts.passwordResetController)
	});
	
	fastify.post('/reset-verify', {
		schema: authResetPasswordVerifySchema,
		...zodFormValidator(zodResetPasswordVerifySchema),
		handler: opts.passwordResetController.resetPasswordVerifyHandler.bind(opts.passwordResetController)
	});
	
	fastify.post('/reset-update', {
		schema: authResetPasswordUpdateSchema,
		...zodFormValidator(zodResetPasswordUpdateSchema),
		handler: opts.passwordResetController.resetPasswordUpdateHandler.bind(opts.passwordResetController)
	});

	// fastify.delete('/revoke-all', authController.RevokeAllRoute.bind(opts.authController));

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