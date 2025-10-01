import { FastifyInstance } from 'fastify';
import { connect, JSONCodec } from 'nats';
import { handleUserRequests } from '../services/Nats/natsHandlers';
import fastifyPlugin from 'fastify-plugin';
import UserService from '../services/User/userService';

interface NatsOpts {
	NATS_URL: string;
	NATS_USER: string;
	NATS_PASSWORD: string;
	userService: UserService;
}

async function natsPlugin(fastify: FastifyInstance, opts: NatsOpts) {
	const { NATS_URL, NATS_USER, NATS_PASSWORD } = opts;

	const nc = await connect({
		servers: NATS_URL,
		// servers: 'nats://localhost:4222', // TODO: to be changed to container name `nats`
		user: NATS_USER,
		pass: NATS_PASSWORD,
		name: 'User Management',
	});
	fastify.log.info('[NATS] Server is up on ' + nc.getServer());

	// This is a JetStream Client
	const js = nc.jetstream();

	// TODO - use this to encode and decode data
	// const stringC = StringCodec(); // for strings
	
	const jsonC = JSONCodec(); // for objects

	fastify.decorate('nc', nc);
	fastify.decorate('js', js);
	fastify.decorate('jsonC', jsonC);

	// TODO - use this in the friend request endpoint
	// 		to notify users through notification microservice 
	// 		when a user sends a `friend request`
	/**
	 * interface NotificationPayload {
	 * 	senderId: number;
	 * 	recipientId: number;
	 * 	type: 'friend_request';
	 * 	message?: string;
	 * 	actionUrl?: string;
	 * }
	 */
	// js.publish("notification.dispatch", jsonC(data));

	/**
	 * ? Subscribe to a subject
	 * ? Your subject is [user.*] { '*' means that could be 'user.image', 'user.username', ...}
	 * Read More ([https://docs.nats.io/nats-concepts/core-nats/reqreply])
	 *           ([https://github.com/nats-io/nats.js/tree/main/core])
	 */

	// subscribe to all user.* subjects
	const sub = nc.subscribe('user.*');

	// TODO: handle exceptions
	async function consumeMessages() {
		for await (const msg of sub) {
			await handleUserRequests(msg, opts.userService);
		}
	}

	consumeMessages();

	fastify.addHook('onClose', async () => {
		await nc.drain();
		await nc.close();
	});
}

export default fastifyPlugin(natsPlugin);
