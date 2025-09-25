import { FastifyInstance } from "fastify";
import AuthController from "../controllers/authController";
import Authenticate from "../middleware/Authenticate";
import { authLoginSchema, authLogoutSchema, authMFAVerifySchema, authOAuthSchema, authRefreshSchema, authRegisterSchema, authResetPasswordSchema, authResetPasswordUpdateSchema, authResetPasswordVerifySchema } from "../schemas/auth.schema";
import cookie from '@fastify/cookie';
import TwoFactorController from "../controllers/twoFactorController";

async function authRouter(fastify: FastifyInstance, opts: { authController: AuthController, twoFactorController: TwoFactorController }) {
	fastify.decorate('authenticate', Authenticate); // auth middleware for protected routes
	fastify.decorate('requireAuth', { preHandler: fastify.authenticate }); // preHandler hook
	fastify.decorateRequest('user', null);
	fastify.register(cookie);

	/*-------------------------------- Local Authentication --------------------------------*/
	fastify.post('/register', {
		schema: authRegisterSchema,
		handler: opts.authController.RegisterEndpoint.bind(opts.authController)
	});
	
	fastify.post('/login', {
		schema: authLoginSchema,
		handler: opts.authController.LoginEndpoint.bind(opts.authController)
	});
	
	fastify.post('/logout', {
		schema: authLogoutSchema,
		preHandler: fastify.authenticate,
		handler: opts.authController.LogoutEndpoint.bind(opts.authController)
	});
	
	fastify.get('/refresh', {
		schema: authRefreshSchema,
		handler: opts.authController.RefreshEndpoint.bind(opts.authController)
	});


	/*-------------------------------- Remote Authentication --------------------------------*/
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
		// TODO: ADD SCHEMA
		// schema: authLoginSchema,
		handler: opts.authController.SendLoginChallenge2FACodeEndpoint.bind(opts.authController)
	});

	fastify.post('/login/2fa/verify', {
		// TODO: ADD SCHEMA
		// schema: authLoginSchema,
		handler: opts.authController.VerifyLoginChallenge2FACodeEndpoint.bind(opts.authController)
	});

	fastify.get('/2fa/enabled', {
		// TODO: ADD SCHEMA
		// schema: auth2FASetupSchema,
		preHandler: fastify.authenticate,
		handler: opts.twoFactorController.EnabledMethodsEndpoint.bind(opts.twoFactorController)
	});

	fastify.delete('/2fa/enabled/:method', {
		// TODO: ADD SCHEMA
		// schema: auth2FASetupSchema,
		preHandler: fastify.authenticate,
		handler: opts.twoFactorController.DisableMethodEndpoint.bind(opts.twoFactorController)
	});

	fastify.post('/2fa/:method/setup/init', {
		// TODO: ADD SCHEMA
		// schema: auth2FASetupSchema,
		preHandler: fastify.authenticate,
		handler: opts.twoFactorController.SetupInitEndpoint.bind(opts.twoFactorController)
	});

	fastify.post('/2fa/:method/setup/verify', {
		// TODO: ADD SCHEMA
		// schema: auth2FASetupSchema,
		preHandler: fastify.authenticate,
		handler: opts.twoFactorController.SetupVerifyEndpoint.bind(opts.twoFactorController)
	});

	/*------------------------------------ Password Management ------------------------------------*/

	// fastify.post('/change-password', {
	// 	preHandler: fastify.authenticate,
	// 	// schema: authResetPasswordSchema,
	// 	handler: opts.authController.changePasswordEndpoint.bind(opts.authController)
	// });

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