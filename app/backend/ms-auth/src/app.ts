import Fastify from 'fastify';
import { FastifyInstance } from 'fastify';
import authRouter from './routes/authRouter';
import { db } from './database/index';
import runMigrations from './database/migrations';
import cors from '@fastify/cors';
import userRouter from './routes/userRouter';
import pinoPretty from 'pino-pretty';
import natsPlugin from './plugins/natsPlugin';
import dotenv from 'dotenv';

// declare module 'fastify' {
// 	interface FastifyInstance {
// 		db: Database;
// 	}
// }

dotenv.config();

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
		}
	  });

	// REGISTER DATABASE PLUGIN
	// fastify.register(SQLitePlugin);
	await fastify.register(cors, {
		origin: true,
		credentials: true,
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
	});

	// REGISTER AUTH PLUGIN
	await fastify.register(natsPlugin, {
		NATS_URL: process.env["NATS_URL"] || "", 
		NATS_USER: process.env["NATS_USER"] || "",
		NATS_PASSWORD: process.env["NATS_PASSWORD"] || "" });
	await fastify.register(authRouter, { prefix: '/auth' });
	await fastify.register(userRouter, { prefix: '/users' });

	return fastify;
}

async function initializeApp() : Promise<FastifyInstance> {
	const DBFilePath = './src/database/database.db'

	try {
		await db.connect(DBFilePath);
		await runMigrations();
	} catch (err) {
		console.log(err);
		process.exit(1);
	}

	return await buildApp();
}

export default initializeApp;