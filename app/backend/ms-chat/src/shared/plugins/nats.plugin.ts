import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { connect, JSONCodec, NatsConnection, StringCodec } from 'nats';
import {
	IChatPayload,
	INotifyBody,
	ISocketPayload,
	NatsOptions,
} from '../types/nats.types';
import ChatServices from '../../services/chat.services';
import { MessageType, UserType } from '../types/database.types';

const natsPlugin = fastifyPlugin(
	async function (fastify: FastifyInstance, opts: NatsOptions) {
		const chatService = new ChatServices();

		const { NATS_PORT, NATS_USER, NATS_PASSWORD } = opts;

		const nc: NatsConnection = await connect({
			servers: `nats://localhost:${NATS_PORT}`,
			user: NATS_USER,
			pass: NATS_PASSWORD,
			name: 'Chat',
		});
		fastify.log.info('[NATS] Server is Running');

		const jcodec = JSONCodec();
		const scoded = StringCodec();

		const js = nc.jetstream();

		const streamName = 'chatStream';
		const consumerName = 'chatConsumer';
		const consumer = await js.consumers.get(streamName, consumerName);

		await consumer.consume({
			callback: (data) => {
				const msgPayload: IChatPayload = jcodec.decode(
					data.data,
				) as IChatPayload;

				// * Save the msg in the DB while returning all the Info
				// TODO: Notify the Notification MicroService for the MSG
				try {
					const MsgInfo: MessageType =
						chatService.handleMessage(msgPayload);

					// * Reply
					const reply = data.headers?.get('reply-to');
					if (reply) {
						const payload: ISocketPayload = {
							sender: msgPayload.sender,
							receiver: msgPayload.receiver,
							data: MsgInfo,
						};
						nc.publish(reply, jcodec.encode(payload));
					}

					// Notify the Notification Service
					const notifyPayload: INotifyBody = {
						from_user: msgPayload.sender,
						to_user: msgPayload.receiver,
						type: 'chat',
						msg: msgPayload.data.message,
						action_url: `/chat/${msgPayload.sender}`,
					};

					nc.publish('notify', jcodec.encode(notifyPayload));
				} catch (error) {
					fastify.log.error(error);
				}
				data.ack();
			},
		});

		nc.subscribe('user.create', {
			callback(err, msg) {
				if (err) {
					fastify.log.error(err);
					return;
				}
				fastify.log.info('[NATS] Message Arrived to `user.create`');

				const payload: UserType = jcodec.decode(msg.data) as UserType;

				if (!payload.username) {
					fastify.log.warn('Invalid Payload: Empty');
					return;
				}

				chatService.registerOrUpdateUser(payload);
			},
		});

		nc.subscribe('user.delete', {
			callback(err, msg) {
				if (err) {
					fastify.log.error(err);
					return;
				}

				fastify.log.info('[NATS] Message Arrived to `user.delete`');

				const username: string = scoded.decode(msg.data);

				chatService.deleteUserData(username);
			},
		});

		// ** DECORATORS
		fastify.decorate('nc', nc);

		fastify.addHook('onClose', async () => {
			fastify.log.info('[ ~ ] Closing NATS');
			await nc.close();
			fastify.log.info('[ + ] NATS Closed Successfully');
		});
	},
	{ name: 'NATS Plugin' },
);

export default natsPlugin;
