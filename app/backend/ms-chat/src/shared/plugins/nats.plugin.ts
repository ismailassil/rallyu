import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { connect, JSONCodec, NatsConnection } from 'nats';
import { IChatPayload, ISocketPayload, NatsOptions } from '../types/nats.types';
import ChatServices from '../../services/chat.services';
import { MessageType } from '../types/database.types';

const natsPlugin = fastifyPlugin(
	async function (fastify: FastifyInstance, opts: NatsOptions) {
		const chatService = new ChatServices();

		const { NATS_PORT, NATS_USER, NATS_PASSWORD } = opts;

		const server: NatsConnection = await connect({
			servers: `nats://localhost:${NATS_PORT}`,
			user: NATS_USER,
			pass: NATS_PASSWORD,
			name: 'Chat',
		});
		fastify.log.info('[NATS] Server is Running');

		const js = server.jetstream();

		const streamName = 'chatStream';
		const consumerName = 'chatConsumer';
		const consumer = await js.consumers.get(streamName, consumerName);

		await consumer.consume({
			callback: (data) => {
				const msgPayload: IChatPayload = JSONCodec().decode(
					data.data,
				) as IChatPayload;

				// * Save the msg in the DB while returning all the Info
				// TODO: Notify the Notification Microservice for the MSG
				// TODO: Handle unexpected errors
				const MsgInfo: MessageType = chatService.handleMessage(msgPayload);

				// * Reply
				const reply = data.headers?.get('reply-to');
				if (reply) {
					const payload: ISocketPayload = {
						sender: msgPayload.sender,
						receiver: msgPayload.receiver,
						data: MsgInfo,
					};
					server.publish(reply, JSONCodec().encode(payload));
				}
				data.ack();
			},
		});

		// ** DECORATORS
		fastify.decorate('nc', server);

		fastify.addHook('onClose', async () => {
			fastify.log.info('[ ~ ] Closing NATS');
			await server.close();
			fastify.log.info('[ + ] NATS Closed Successfully');
		});
	},
	{ name: 'NATS Plugin' },
);

export default natsPlugin;
