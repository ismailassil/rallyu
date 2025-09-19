import Fastify from 'fastify';
import { FastifyInstance } from 'fastify';
import authRouter from './routes/authRouter';
import { db } from './database/index';
import runMigrations from './database/migrations';
import cors from '@fastify/cors';
import userRouter from './routes/userRouter';
import pinoPretty from 'pino-pretty';
import natsPlugin from './plugins/natsPlugin';
import { appConfig } from './config';
import JWTUtils from './utils/auth/Auth';
import UserRepository from './repositories/userRepository';
import SessionRepository from './repositories/sessionRepository';
import TwoFactorRepository from './repositories/twoFactorRepository';
import UserService from './services/userService';
import RelationsRepository from './repositories/relationsRepository';
import SessionService from './services/sessionService';
import { authConfig } from './config/auth';
import TwoFactorService from './services/twoFactorService';
import AuthService from './services/authService';
import AuthController from './controllers/authController';
import TwoFactorController from './controllers/twoFactorController';

async function buildApp(): Promise<FastifyInstance> {
	const fastify: FastifyInstance = Fastify({
		logger: {
		  transport: {
			target: 'pino-pretty',
			options: {
			  colorize: true,
			  translateTime: 'SYS:standard', // human-readable timestamp
			  ignore: 'pid,hostname'         // remove unnecessary fields
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
	const sessionsRepository = new SessionRepository();
	const twoFactorRepository = new TwoFactorRepository();

	// INIT SERVICES
	const sessionService = new SessionService(authConfig, jwtUtils, sessionsRepository);
	const twoFactorService = new TwoFactorService(twoFactorRepository);
	const userService = new UserService(userRepository);
	const authService = new AuthService(authConfig, jwtUtils, userService, sessionService, twoFactorService);

	// INIT CONTROLLERS
	const authController = new AuthController(authService, twoFactorService);
	const twoFactorController = new TwoFactorController(twoFactorService);
	

	// REGISTER AUTH PLUGIN
	// await fastify.register(natsPlugin, {
	// 	NATS_URL: process.env["NATS_URL"] || "", 
	// 	NATS_USER: process.env["NATS_USER"] || "",
	// 	NATS_PASSWORD: process.env["NATS_PASSWORD"] || "" });
	await fastify.register(authRouter, { prefix: '/auth', authController, twoFactorController });
	// await fastify.register(userRouter, { prefix: '/users' });

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