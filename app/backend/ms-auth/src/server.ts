import initializeApp from "./app";
import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { env } from "./config/env";

async function main() {
	const fastify: FastifyInstance = await initializeApp();

	// const mailService = new MailingService();

	// await mailService.sendEmail({
	// 	from: 'no-reply@rally.com',
	// 	to: 'nabilos.fb@gmail.com',
	// 	subject: 'Rallyu server just started!',
	// 	text: 'This is a test email sent from the Rally authentication server.'
	// });
	
	fastify.get('/', (request: FastifyRequest, reply: FastifyReply) => {
		reply.code(200).send('pong');
	});

	fastify.listen({ host: '0.0.0.0', port: env.PORT }, (err: Error | null, address: string) => {
		if (err)
			process.exit(1);
		fastify.log.info(`Server listening at ${address}:${env.PORT}`);
	});
}

main();

export default fastify;