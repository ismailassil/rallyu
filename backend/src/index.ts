import dotenv from 'dotenv';
import fastifyBcrypt from 'fastify-bcrypt';
import authRoutes from './auth/routes/auth.routes.js';
import { app as fastify } from './app.js';
import databasePlugin from './auth/models/auth.model.js';
import schemasPlugin from './auth/shared/plugins/schemas.plugin.js';
import checkersPlugin from './auth/shared/plugins/checkers.plugin.js';
import helpersPlugin from './auth/shared/plugins/helpers.plugin.js';
import jwtPlugin from './auth/shared/plugins/jwt.plugin.js';
import cookiePlugin from './auth/shared/plugins/cookie.plugin.js';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Import && Register Plugins
fastify.register(databasePlugin);
fastify.register(jwtPlugin);
fastify.register(fastifyBcrypt, { saltWorkFactor: 12 });
fastify.register(cookiePlugin);

fastify.register(helpersPlugin);
fastify.register(checkersPlugin);
fastify.register(schemasPlugin);
fastify.register(authRoutes, { prefix: '/api/auth' });

// Start the Server
async function main() {
	try {
		const address = await fastify.listen({ port: PORT });
		fastify.log.info(`Server is running at ${address}`);
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
}

main();
