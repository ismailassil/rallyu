import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import AuthController from "../controllers/AuthController";
import { zodPreHandler } from "../utils/validation/zodFormValidator";
import TwoFactorController from "../controllers/TwoFactorController";
import PasswordResetController from "../controllers/PasswordResetController";
import { authRoutesSchemas as schemas } from "../schemas/auth.schema";
import { authRoutesZodSchemas as zodSchemas } from "../schemas/zod/auth.zod.schema";
import { oauthConfig } from "../config/oauth";
import VerificationController from "../controllers/VerificationController";
import { requestFingerprintHook } from "../middleware/hooks/fingerprintHook";

async function authRouter(fastify: FastifyInstance, opts: {
	authController: AuthController,
	twoFactorController: TwoFactorController,
	verificationController: VerificationController,
	passwordResetController: PasswordResetController
}) {
	fastify.addHook('onRequest', requestFingerprintHook);

	/*-------------------------------- Local Authentication --------------------------------*/
	fastify.post('/register', {
		schema: schemas.core.register,
		preHandler: [
			zodPreHandler(zodSchemas.core.register)
		],
		handler: opts.authController.registerHandler.bind(opts.authController)
	});

	fastify.post('/login', {
		schema: schemas.core.login,
		handler: opts.authController.loginHandler.bind(opts.authController)
	});

	fastify.post('/logout', {
		preHandler: [
			fastify.refreshTokenAuth
		],
		handler: opts.authController.logoutHandler.bind(opts.authController)
	});

	fastify.get('/refresh', {
		preHandler: fastify.refreshTokenAuth,
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
		schema: schemas.twoFactor.login.select,
		handler: opts.authController.sendTwoFAChallengeHandler.bind(opts.authController)
	});
	fastify.post('/login/2fa/verify', {
		schema: schemas.twoFactor.login.verify,
		handler: opts.authController.verifyTwoFAChallengeHandler.bind(opts.authController)
	});
	fastify.post('/login/2fa/resend', {
		schema: schemas.twoFactor.login.resend,
		handler: opts.authController.resendTwoFAChallengeHandler.bind(opts.authController)
	});

	fastify.get('/2fa/enabled', {
		preHandler: fastify.accessTokenAuth,
		handler: opts.twoFactorController.fetchEnabledMethodsHandler.bind(opts.twoFactorController)
	});
	fastify.post('/2fa/enabled/:method', {
		schema: schemas.twoFactor.manage.enable,
		preHandler: fastify.accessTokenAuth,
		handler: opts.twoFactorController.enableMethodHandler.bind(opts.twoFactorController)
	});
	fastify.delete('/2fa/enabled/:method', {
		schema: schemas.twoFactor.manage.disable,
		preHandler: fastify.accessTokenAuth,
		handler: opts.twoFactorController.disableMethodHandler.bind(opts.twoFactorController)
	});

	fastify.post('/2fa/setup-totp', {
		schema: schemas.twoFactor.setup.totp.request,
		preHandler: fastify.accessTokenAuth,
		handler: opts.twoFactorController.setupTOTPHandler.bind(opts.twoFactorController)
	});
	fastify.post('/2fa/setup-totp/verify', {
		schema: schemas.twoFactor.setup.totp.verify,
		preHandler: fastify.accessTokenAuth,
		handler: opts.twoFactorController.verifyTOTPHandler.bind(opts.twoFactorController)
	});


	/*--------------------------------------------- Password Management ---------------------------------------------*/

	fastify.post('/change-password', {
		schema: schemas.password.change,
		preHandler: [
			fastify.accessTokenAuth,
			zodPreHandler(zodSchemas.password.change)
		],
		handler: opts.authController.changePasswordHandler.bind(opts.authController)
	});

	fastify.post('/reset-password', {
		schema: schemas.password.reset.request,
		preHandler: [
			zodPreHandler(zodSchemas.password.reset.request),
		],
		handler: opts.passwordResetController.requestHandler.bind(opts.passwordResetController)
	});
	fastify.post('/reset-password/verify', {
		schema: schemas.password.reset.verify,
		handler: opts.passwordResetController.verifyHandler.bind(opts.passwordResetController)
	});
	fastify.post('/reset-password/update', {
		schema: schemas.password.reset.update,
		handler: opts.passwordResetController.useHandler.bind(opts.passwordResetController)
	});
	fastify.post('/reset-password/resend', {
		schema: schemas.password.reset.resend,
		handler: opts.passwordResetController.resendHandler.bind(opts.passwordResetController)
	});

	/*--------------------------------------------------- Sessions ---------------------------------------------------*/
	fastify.get('/sessions', {
		preHandler: [
			fastify.accessTokenAuth,
			fastify.refreshTokenAuth
		],
		handler: opts.authController.fetchSessionsHandler.bind(opts.authController)
	});
	fastify.delete('/sessions/:session_id', {
		schema: schemas.session.delete,
		preHandler: [
			fastify.accessTokenAuth,
			fastify.refreshTokenAuth
		],
		handler: opts.authController.revokeSessionHandler.bind(opts.authController)
	});
	fastify.delete('/sessions', {
		preHandler: [
			fastify.accessTokenAuth,
			fastify.refreshTokenAuth
		],
		handler: opts.authController.revokeMassSessionsHandler.bind(opts.authController)
	});

	/*-------------------------------------------------- Verification --------------------------------------------------*/
	fastify.post('/verify-:contact', {
		schema: schemas.verifyContact.request,
		preHandler: fastify.accessTokenAuth,
		handler: opts.verificationController.requestHandler.bind(opts.verificationController)
	});
	fastify.post('/verify-:contact/verify', {
		schema: schemas.verifyContact.verify,
		preHandler: fastify.accessTokenAuth,
		handler: opts.verificationController.verifyHandler.bind(opts.verificationController)
	});
	fastify.post('/verify-:contact/resend', {
		schema: schemas.verifyContact.resend,
		preHandler: fastify.accessTokenAuth,
		handler: opts.verificationController.resendHandler.bind(opts.verificationController)
	});
}

export default authRouter;
