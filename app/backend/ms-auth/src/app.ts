import Fastify from 'fastify';
import { FastifyInstance } from 'fastify';
import authRouter from './routes/authRouter';
import { db } from './database/index';
import runMigrations from './database/migrations';
import cors from '@fastify/cors';
import userRouter from './routes/userRouter';
import { appConfig } from './config';
import JWTUtils from './utils/auth/Auth';
import UserRepository from './repositories/userRepository';
import TwoFactorRepository from './repositories/twoFactorRepository';
import UserService from './services/User/userService';
import RelationsRepository from './repositories/RelationsRepository';
import SessionService from './services/Auth/SessionsService';
import { authConfig } from './config/auth';
import AuthService from './services/Auth/AuthService';
import AuthController from './controllers/AuthController';
import TwoFactorController from './controllers/TwoFactorController';
import UserController from './controllers/UserController';
import RelationsController from './controllers/RelationsContoller';
import RelationsService from './services/User/relationsService';
import StatsService from './services/GameAndStats/statsService';
import StatsRepository from './repositories/statsRepository';
import MatchesRepository from './repositories/matchesRepository';
import WhatsAppService from './services/Communication/WhatsAppService';
import MailingService from './services/Communication/MailingService';
import PasswordResetController from './controllers/PasswordResetController';
import ResetPasswordRepository from './repositories/ResetPasswordRepository';
import PasswordResetService from './services/Auth/PasswordResetService';
import TwoFactorMethodService from './services/TwoFactorAuth/TwoFactorMethodService';
import TwoFactorChallengeService from './services/TwoFactorAuth/TwoFactorChallengeService';
import SessionsRepository from './repositories/SessionsRepository';
import natsPlugin from './plugins/natsPlugin';

async function buildApp(): Promise<FastifyInstance> {
	const fastify: FastifyInstance = Fastify({
		logger: {
		  transport: {
			target: 'pino-pretty',
			options: {
			  colorize: true,
			  translateTime: 'SYS:standard',
			  ignore: 'pid,hostname'
			}
		  }
		},
		ajv: {
			customOptions: {
				removeAdditional: false,
				allErrors: true
			}
		}
	});

	// REGISTER DATABASE PLUGIN
	// fastify.register(SQLitePlugin);
	await fastify.register(cors, {
		origin: true,
		credentials: true,
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
	});

	// INIT UTILS
	const jwtUtils = new JWTUtils();

	// INIT REPOSITORIES
	const userRepository = new UserRepository();
	const sessionsRepository = new SessionsRepository();
	const twoFactorRepository = new TwoFactorRepository();
	const relationsRepository = new RelationsRepository();
	const statsRepository = new StatsRepository();
	const matchesRepository = new MatchesRepository();
	const resetPasswordRepository = new ResetPasswordRepository();

	// INIT SERVICES
	const whatsAppService = new WhatsAppService(fastify.log);
	// await whatsAppService.isReady; // TODO: HANDLE ERRORS
	const mailingService = new MailingService(appConfig.mailing);
	const sessionsService = new SessionService(authConfig, jwtUtils, sessionsRepository);
	const statsService = new StatsService(userRepository, statsRepository);
	const relationsService = new RelationsService(userRepository, relationsRepository);
	const userService = new UserService(userRepository, relationsService, statsService, matchesRepository);
	const twoFAMethodService = new TwoFactorMethodService(twoFactorRepository, userService, mailingService, whatsAppService);
	const twoFAChallengeService = new TwoFactorChallengeService(twoFactorRepository, userService, mailingService, whatsAppService);
	const authService = new AuthService(authConfig, jwtUtils, userService, sessionsService, twoFAMethodService, twoFAChallengeService, mailingService, whatsAppService);
	const passwordResetService = new PasswordResetService(authConfig, userService, resetPasswordRepository, mailingService, whatsAppService);

	// INIT CONTROLLERS
	const passwordResetController = new PasswordResetController(passwordResetService);
	const authController = new AuthController(authService);
	const twoFactorController = new TwoFactorController(twoFAMethodService);
	const userController = new UserController(userService);
	const relationsController= new RelationsController(relationsService);
	

	// REGISTER AUTH PLUGIN
	await fastify.register(natsPlugin, {
		NATS_URL: process.env["NATS_URL"] || "", 
		NATS_USER: process.env["NATS_USER"] || "",
		NATS_PASSWORD: process.env["NATS_PASSWORD"] || "",
		userService: userService
	});
	await fastify.register(authRouter, { prefix: '/auth', authController, twoFactorController, passwordResetController });
	await fastify.register(userRouter, { prefix: '/users', userController, relationsController });

	return fastify;
}

async function initializeApp() : Promise<FastifyInstance> {
	try {
		await db.connect(appConfig.db.dbPath);
		await runMigrations();
		return await buildApp();
	} catch (err) {
		console.log('APP BUILD ERROR:', err);
		process.exit(1);
	}
}

export default initializeApp;