import authRoutes from './auth/Routes/authRoutes.js';
import { app as fastify } from './app.js';
import dotenv from 'dotenv';
import databasePlugin from './auth/Models/AuthModel.js';
import fastifyBcrypt from 'fastify-bcrypt';
import schemasPlugin from './auth/Plugins/schemasPlugin.js';
import checkersPlugin from './auth/Plugins/checkersPlugin.js';
import helpersPlugin from './auth/Plugins/helpersPlugin.js';
import jwtPlugin from './auth/Plugins/jwtPlugin.js';
dotenv.config();
const PORT = parseInt(process.env.PORT || '5000', 10);
// Import && Register Plugins
fastify.register(databasePlugin);
fastify.register(jwtPlugin);
fastify.register(fastifyBcrypt, { saltWorkFactor: 12 });
fastify.register(helpersPlugin);
fastify.register(checkersPlugin);
fastify.register(schemasPlugin);
fastify.register(authRoutes, { prefix: '/api/auth' });
// Start the Server
async function main() {
    try {
        const address = await fastify.listen({ port: PORT });
        fastify.log.info(`Server is running at ${address}`);
    }
    catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}
main();
