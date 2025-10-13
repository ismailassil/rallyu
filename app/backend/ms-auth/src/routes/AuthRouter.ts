import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import AuthController from "../controllers/AuthController";
import Authenticate from "../middleware/Authenticate";
import { zodFormValidator } from "../utils/validation/zodFormValidator";
import cookie from '@fastify/cookie';
import TwoFactorController from "../controllers/TwoFactorController";
import PasswordResetController from "../controllers/PasswordResetController";
import {
	auth2FADisableSchema,
	auth2FALoginChallengeSchema,
	auth2FALoginChallengeVerifyCodeSchema,
	auth2FASetupSchema,
	auth2FAVerifySchema,
	authChallengeResendSchema,
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
	zodVerifyChallengeBodySchema,
	zodTwoFALoginChallengeBodySchema,
	zodResendSchema,
} from "../schemas/zod/auth.zod.schema";
import { UAParser } from "ua-parser-js";
import { oauthConfig } from "../config/oauth";
import VerificationController from "../controllers/VerificationController";

async function authRouter(fastify: FastifyInstance, opts: {
	authController: AuthController,
	twoFactorController: TwoFactorController,
	verificationController: VerificationController,
	passwordResetController: PasswordResetController
}) {
	fastify.decorate('authenticate', Authenticate); // auth middleware for protected routes
	fastify.decorate('requireAuth', { preHandler: fastify.authenticate }); // preHandler hook
	fastify.decorateRequest('user', null);
	fastify.decorateRequest('refreshToken', null);
	fastify.decorateRequest('fingerprint', null);
	fastify.addHook('preHandler', async (request, reply) => {
		const parser = new UAParser(request.headers['user-agent'] || '');

		const device = parser.getDevice();
		const browser = parser.getBrowser();
		const os = parser.getOS();

		request.fingerprint = {
			device: device.type?.toString() || 'Desktop',
			browser: `${browser.name?.toString() || 'Unknown Browser'} on ${os.name?.toString() || 'Unknown OS'}`,
			ip_address: request.ip
		}
		console.log('Request Fingerprint: ', request.fingerprint);

		if (request.cookies && request.cookies?.['refreshToken']) {
			request.refreshToken = request.cookies?.['refreshToken'];
		} else
			request.refreshToken = null;

		console.log('refreshToken from cookies: ', request.refreshToken);
	});

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
	fastify.get('/google', (request: FastifyRequest, reply: FastifyReply) => {
		const scope = ['openid', 'profile', 'email'];

		const googleOAuthConsentURL = oauthConfig.google.auth_uri + '?' +
		new URLSearchParams({
			client_id: oauthConfig.google.client_id,
			redirect_uri: oauthConfig.google.redirect_uri,
			response_type: 'code',
			scope: scope.join(' '),
			access_type: 'offline',
			prompt: 'consent'
		});

		console.log('googleOAuthConsentURL: ', googleOAuthConsentURL);
		reply.redirect(googleOAuthConsentURL);
	});

	fastify.get('/google/callback', {
		handler: opts.authController.googleOAuthCallbackHandler.bind(opts.authController)
	});

	fastify.get('/42', (request: FastifyRequest, reply: FastifyReply) => {
		const scope = 'public';

		const intra42OAuthConsentURL = oauthConfig.intra42.auth_uri + '?' +
		new URLSearchParams({
			client_id: oauthConfig.intra42.client_id,
			redirect_uri: oauthConfig.intra42.redirect_uri,
			response_type: 'code',
			scope: scope
		});

		reply.redirect(intra42OAuthConsentURL);
	});

	fastify.get('/42/callback', {
		handler: opts.authController.intra42OAuthCallbackHandler.bind(opts.authController)
	});



	/*------------------------------------------ Multi-Factor Authentication -----------------------------------------*/

	fastify.post('/login/2fa/select', {
		schema: auth2FALoginChallengeSchema,
		...zodFormValidator(zodTwoFALoginChallengeBodySchema),
		handler: opts.authController.sendTwoFAChallengeHandler.bind(opts.authController)
	});
	fastify.post('/login/2fa/verify', {
		schema: auth2FALoginChallengeVerifyCodeSchema,
		...zodFormValidator(zodVerifyChallengeBodySchema),
		handler: opts.authController.verifyTwoFAChallengeHandler.bind(opts.authController)
	});
	fastify.post('/login/2fa/resend', {
		schema: authChallengeResendSchema,
		...zodFormValidator(zodResendSchema),
		handler: opts.authController.resendTwoFAChallengeHandler.bind(opts.authController)
	});

	fastify.get('/2fa/enabled', {
		preHandler: fastify.authenticate,
		handler: opts.twoFactorController.fetchEnabledMethodsHandler.bind(opts.twoFactorController)
	});
	fastify.post('/2fa/enabled/:method', {
		preHandler: fastify.authenticate,
		handler: opts.twoFactorController.enableMethodHandler.bind(opts.twoFactorController)
	});
	fastify.delete('/2fa/enabled/:method', {
		// schema: auth2FADisableSchema,
		preHandler: fastify.authenticate,
		handler: opts.twoFactorController.disableMethodHandler.bind(opts.twoFactorController)
	});

	fastify.post('/2fa/setup-totp', {
		// schema: auth2FASetupSchema,
		preHandler: fastify.authenticate,
		handler: opts.twoFactorController.setupTOTPHandler.bind(opts.twoFactorController)
	});
	fastify.post('/2fa/setup-totp/verify', {
		// schema: auth2FASetupSchema,
		preHandler: fastify.authenticate,
		handler: opts.twoFactorController.verifyTOTPHandler.bind(opts.twoFactorController)
	});


	/*--------------------------------------------- Password Management ---------------------------------------------*/

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
	fastify.post('/reset-password/verify', {
		schema: authResetPasswordVerifySchema,
		...zodFormValidator(zodResetPasswordVerifySchema),
		handler: opts.passwordResetController.resetPasswordVerifyHandler.bind(opts.passwordResetController)
	});
	fastify.post('/reset-password/update', {
		schema: authResetPasswordUpdateSchema,
		...zodFormValidator(zodResetPasswordUpdateSchema),
		handler: opts.passwordResetController.resetPasswordUpdateHandler.bind(opts.passwordResetController)
	});
	fastify.post('/reset-password/resend', {
		schema: authChallengeResendSchema,
		...zodFormValidator(zodResendSchema),
		handler: opts.passwordResetController.resendHandler.bind(opts.passwordResetController)
	});

	// fastify.delete('/revoke-all', authController.RevokeAllRoute.bind(opts.authController));

	// SESSION / DEVICE MANAGEMENT
	fastify.get('/sessions', {
		preHandler: fastify.authenticate,
		handler: opts.authController.getActiveSessionsHandler.bind(opts.authController)
	});
	fastify.delete('/sessions/:id', {
		preHandler: fastify.authenticate,
		handler: opts.authController.revokeSessionHandler.bind(opts.authController)
	});
	fastify.delete('/sessions', {
		preHandler: fastify.authenticate,
		handler: opts.authController.revokeAllSessionsHandler.bind(opts.authController)
	});

	/*-------------------------------------------------- Verification --------------------------------------------------*/
	fastify.post('/verify-:_for', {
		preHandler: fastify.authenticate,
		handler: opts.verificationController.requestHandler.bind(opts.verificationController)
	});
	fastify.post('/verify-:_for/verify', {
		preHandler: fastify.authenticate,
		handler: opts.verificationController.verifyHandler.bind(opts.verificationController)
	});
	fastify.post('/verify-:_for/resend', {
		preHandler: fastify.authenticate,
		handler: opts.verificationController.resendHandler.bind(opts.verificationController)
	});
}

export default authRouter;
