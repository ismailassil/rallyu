import Fastify from 'fastify';
import { FastifyInstance } from 'fastify';
import authRouter from './routes/AuthRouter';
import { db } from './database/index';
import runMigrations from './database/migrations';
import cors from '@fastify/cors';
import userRouter from './routes/UserRouter';
import { appConfig } from './config';
import JWTUtils from './utils/auth/JWTUtils';
import UserRepository from './repositories/UserRepository';
import TwoFactorRepository from './repositories/TwoFactorRepository';
import UserService from './services/User/UserService';
import RelationsRepository from './repositories/RelationsRepository';
import SessionService from './services/Auth/SessionsService';
import { authConfig } from './config/auth';
import AuthService from './services/Auth/AuthService';
import AuthController from './controllers/AuthController';
import TwoFactorController from './controllers/TwoFactorController';
import UserController from './controllers/UserController';
import RelationsController from './controllers/RelationsContoller';
import RelationsService from './services/User/RelationsService';
import StatsService from './services/GameAndStats/StatsService';
import StatsRepository from './repositories/StatsRepository';
import MatchesRepository from './repositories/MatchesRepository';
import WhatsAppService from './services/Communication/WhatsAppService';
import MailingService from './services/Communication/MailingService';
import PasswordResetController from './controllers/PasswordResetController';
import PasswordResetService from './services/Auth/PasswordResetService';
import TwoFactorMethodService from './services/TwoFactorAuth/TwoFactorMethodService';
import TwoFactorChallengeService from './services/TwoFactorAuth/TwoFactorChallengeService';
import SessionsRepository from './repositories/SessionsRepository';
import natsPlugin from './plugins/natsPlugin';
import VerificationController from './controllers/VerificationController';
import VerificationService from './services/Auth/VerificationService';
import MatchesController from './controllers/MatchesController';
import MatchesService from './services/GameAndStats/MatchesService';
import errorHandlerPlugin from './plugins/errorHandler';
import accessTokenAuth from './middleware/auth/accessTokenAuth';
import refreshTokenAuth from './middleware/auth/refreshTokenAuth';
import cookie from '@fastify/cookie';
import { attachTokensHook } from './middleware/hooks/attachTokensHook';
import apiKeyAuth from './middleware/auth/apiKeyAuth';
import resourceOwnershipAuth from './middleware/auth/resourceOwnershipAuth';
import CDNService from './services/CDN/CDNService';
import AuthChallengesRepository from './repositories/AuthChallengesRepository';
import logger from './utils/misc/logger';

async function buildApp(): Promise<FastifyInstance> {
	const fastify: FastifyInstance = Fastify({
		logger: { level: 'trace', transport: { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' } } },
		ajv: { customOptions: { removeAdditional: false, allErrors: true }}
	});

	await fastify.register(cors, {
		origin: true,
		credentials: true,
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
	});

	await fastify.register(cookie);
	await fastify.register(errorHandlerPlugin);


	fastify.addHook('preHandler', attachTokensHook);
	fastify.decorate('accessTokenAuth', accessTokenAuth);
	fastify.decorate('refreshTokenAuth', refreshTokenAuth);
	fastify.decorate('apiKeyAuth', apiKeyAuth);
	fastify.decorate('resourceOwnershipAuth', resourceOwnershipAuth);
	fastify.decorateRequest('bearerToken', null);
	fastify.decorateRequest('accessToken', null);
	fastify.decorateRequest('refreshToken', null);
	fastify.decorateRequest('apiKey', null);
	fastify.decorateRequest('user', null);
	fastify.decorateRequest('accessTokenPayload', null);
	fastify.decorateRequest('refreshTokenPayload', null);
	fastify.decorateRequest('fingerprint', null);

	// INIT UTILS
	const jwtUtils = new JWTUtils(authConfig);

	// INIT REPOSITORIES
	const userRepository = new UserRepository();
	const sessionsRepository = new SessionsRepository();
	const twoFactorRepository = new TwoFactorRepository();
	const relationsRepository = new RelationsRepository();
	const statsRepository = new StatsRepository();
	const matchesRepository = new MatchesRepository();
	const authChallengesRepository = new AuthChallengesRepository();

	// INIT SERVICES
	const cdnService = new CDNService();
	const whatsAppService = new WhatsAppService({ authDir: 'wp-session', adminJid: '212636299820@s.whatsapp.net' });
	const mailingService = new MailingService(appConfig.mailing);
	const sessionsService = new SessionService(authConfig, jwtUtils, sessionsRepository);
	const statsService = new StatsService(userRepository, statsRepository);
	const relationsService = new RelationsService(userRepository, relationsRepository);
	const userService = new UserService(userRepository, relationsService, statsService, matchesRepository, cdnService);
	const twoFAMethodService = new TwoFactorMethodService(twoFactorRepository, userService, authChallengesRepository);
	const twoFAChallengeService = new TwoFactorChallengeService(twoFactorRepository, userService, mailingService, whatsAppService, authChallengesRepository);
	const authService = new AuthService(authConfig, jwtUtils, userService, sessionsService, twoFAMethodService, twoFAChallengeService, cdnService);
	const passwordResetService = new PasswordResetService(authConfig, userService, mailingService, authChallengesRepository);
	const verificationService = new VerificationService(userService, mailingService, whatsAppService, authChallengesRepository);
	const matchesService = new MatchesService(statsService, matchesRepository);

	await fastify.register(natsPlugin, {
		NATS_URL: process.env["NATS_URL"] || "",
		NATS_USER: process.env["NATS_USER"] || "",
		NATS_PASSWORD: process.env["NATS_PASSWORD"] || "",
		userService: userService,
		relationsService: relationsService
	});

	// INIT CONTROLLERS
	const passwordResetController = new PasswordResetController(passwordResetService);
	const authController = new AuthController(authService, sessionsService, fastify.nats, fastify.js);
	const twoFactorController = new TwoFactorController(twoFAMethodService);
	const userController = new UserController(userService, fastify.nats, fastify.js);
	const relationsController = new RelationsController(relationsService, fastify.nats, fastify.js);
	const verificationController = new VerificationController(verificationService, fastify.nats, fastify.js);
	const matchesController = new MatchesController(matchesService);

	await fastify.register(authRouter, {
		prefix: '/auth',
		authController,
		twoFactorController,
		verificationController,
		passwordResetController
	});

	await fastify.register(userRouter, {
		prefix: '/users',
		userController,
		relationsController,
		matchesController
	});

	return fastify;
}

async function initializeApp() : Promise<FastifyInstance> {
	try {
		await db.connect(appConfig.db.dbPath);
		await runMigrations();
		return await buildApp();
	} catch (err) {
		logger.error({ err }, '[APP] Build Error');
		process.exit(1);
	}
}

export default initializeApp;
