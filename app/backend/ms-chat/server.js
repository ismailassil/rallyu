import Fastify from 'fastify';
import dbConnector from './plugin/database.plugin.js';
import natsPlugin from './plugin/nats.plugin.js';
import dotenv from '@dotenvx/dotenvx';
import chalk from 'chalk';


// # Remove test.js


dotenv.config();

const fastify = Fastify({
	logger: {
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
			},
		},
	},
});

await fastify.register(dbConnector);
await fastify.register(natsPlugin, {
	NATS_URL: process.env.NATS_URL,
	NATS_USER: process.env.NATS_USER,
	NATS_PASSWORD: process.env.NATS_PASSWORD,
});

fastify.get('/chat/history', async (req, res) => {
	const userId = Number(req.headers['x-user-id']); // ensure it's a number

	if (!userId) {
		return res.status(400).send({ error: 'Missing or invalid user ID' });
	}

	try {
		const statement = fastify.db.prepare(
			`SELECT * FROM message 
			 WHERE senderId = ? OR receiverId = ?
			 ORDER BY created_at ASC`
		);

		const result = statement.all(userId, userId);

		// fastify.log.info(chalk.yellow(`--->${JSON.stringify(result, null, 2)}`));

		res.send(result);
	} catch (error) {
		console.error('Error fetching messages:', error);
		res.status(500).send({ error: 'Failed to retrieve messages' });
	}
});





fastify.listen({ port: 5011, host: '::' }, (err) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});