import { FastifyInstance } from 'fastify';
import { connect, JSONCodec } from 'nats';
import { handleUserRequests } from '../services/Nats/natsHandlers';
import fastifyPlugin from 'fastify-plugin';
import UserService from '../services/User/UserService';
import RelationsService from '../services/User/RelationsService';

interface NatsOpts {
	NATS_URL: string;
	NATS_USER: string;
	NATS_PASSWORD: string;
	userService: UserService;
	relationsService: RelationsService;
}

async function natsPlugin(fastify: FastifyInstance, opts: NatsOpts) {
	const { NATS_URL, NATS_USER, NATS_PASSWORD } = opts;

	const nats = await connect({
		servers: NATS_URL,
		user: NATS_USER,
		pass: NATS_PASSWORD,
		name: 'User Management',
	});
	fastify.log.info('[NATS] Connection established on ' + nats.getServer());

	const js = nats.jetstream(); // JetStream Client
	const jsonC = JSONCodec(); // for objects
	// const stringC = StringCodec(); // for strings

	fastify.decorate('nats', nats);
	fastify.decorate('js', js);
	fastify.decorate('jsonC', jsonC);

	// subscribe to all user.* subjects
	const sub = nats.subscribe('user.*');

	// TODO: handle exceptions
	async function consumeMessages() {
		for await (const msg of sub) {
			await handleUserRequests(msg, opts.userService, opts.relationsService);
		}
	}

	consumeMessages();

	fastify.addHook('onClose', async () => {
		await nats.drain();
		await nats.close();
	});
}

export default fastifyPlugin(natsPlugin);
