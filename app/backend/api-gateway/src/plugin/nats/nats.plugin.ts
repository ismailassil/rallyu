import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import {
	AckPolicy,
	Codec,
	connect,
	createInbox,
	DeliverPolicy,
	headers,
	JSONCodec,
	MsgHdrs,
	nanos,
	NatsConnection,
	StringCodec,
} from 'nats';
import { dataType, NatsPluginOpts } from './nats.types';
import chalk from 'chalk';
import { ISocketPayload, MessageType } from '../socketio/socketio.types';

export const natsPlugin = fp(
	async (fastify: FastifyInstance, opts: NatsPluginOpts) => {
		const { NATS_USER, NATS_PASSWORD } = opts;
		const jcodec = JSONCodec();
		const scodec = StringCodec();

		try {
			const nats: NatsConnection = await connect({
				servers: 'nats://localhost:4222',
				user: NATS_USER,
				pass: NATS_PASSWORD,
				name: 'Gateway',
			});

			fastify.log.info(
				`[NATS] Server Connection Established ${nats.getServer()}`,
			);

			// ** JetStreams
			const natsManager = await nats.jetstreamManager();

			const streamName = 'chatStream';
			const subject = 'chat.*';
			await natsManager.streams
				.info(streamName)
				.then(() => {
					fastify.log.info(
						`[NATS] Stream: <${chalk.yellow(
							streamName,
						)}> already Created`,
					);
				})
				.catch(async (error) => {
					if (error) {
						fastify.log.error('[NATS] ' + error.message);
						await natsManager.streams.add({
							name: streamName,
							subjects: [subject],
							max_age: nanos(1.8e6), // 30min
							description:
								'[NATS] Stream for chat Micro-service binded with Websockets',
						});
						fastify.log.info(
							`[NATS] Stream <${chalk.yellow(
								streamName,
							)}> has been created successfully`,
						);
					}
				});

			// Consumer for Chat `ChatConsumer`
			const consumerName = 'chatConsumer';
			const chatReply = createInbox();

			await natsManager.consumers
				.info(streamName, consumerName)
				.then((info) => {
					fastify.log.info(
						`[NATS] Consumer <${chalk.yellow(
							info.name,
						)}> already exists with name `,
					);
				})
				.catch(async (err) => {
					if (err) {
						fastify.log.error(err.message);
						await natsManager.consumers.add(streamName, {
							durable_name: 'chatConsumer',
							ack_policy: AckPolicy.Explicit,
							deliver_policy: DeliverPolicy.All,
						});
						fastify.log.info(
							`[NATS] Consumer <${chalk.yellow(
								consumerName,
							)}> has been created successfully`,
						);
					}
				});

			const header = headers();
			header.set('reply-to', createInbox());

			nats.subscribe(chatReply, {
				async callback(err, msg) {
					if (err) {
						fastify.log.error(err);
						return;
					}
					// redirect the msg to the clients through sockets
					fastify.log.info(msg.data);
					const payload: ISocketPayload = jcodec.decode(
						msg.data,
					) as ISocketPayload;

					// send to both, sender and receiver
					fastify.io
						.to(payload.sender)
						.to(payload.receiver)
						.emit('send_msg', payload);
				},
			});

			// JetStream Client to Communicate with other Clients
			const js = nats.jetstream();

			// ** NATS Core
			nats.subscribe('notification', {
				async callback(err, msg) {
					if (err) {
						fastify.log.error(err);
						return;
					}
					fastify.log.info('[NATS] Message Arrived to `notification`');

					const payload: dataType = jcodec.decode(msg.data) as dataType;

					fastify.log.info(payload);
					if (!payload.username || !payload.data || !payload.type) {
						fastify.log.warn('Invalid Payload: Empty');
						return;
					}

					fastify.io.in(payload.username).emit(payload.type, payload.data);
				},
			});

			// ** NATS Decorator
			fastify.decorate('nats', nats);
			fastify.decorate('js', js);
			fastify.decorate('chatSubj', subject);
			fastify.decorate('jsCodec', jcodec);
			fastify.decorate('scCodec', scodec);
			fastify.decorate('headerReplyTo', header);

			fastify.addHook('onClose', async () => {
				await natsManager.streams.delete(streamName);
				await nats.close();
				fastify.log.info('[NATS] Server Closed Successfully');
			});
		} catch (err) {
			fastify.log.error(err);
			return;
		}
	},
	{ name: 'NATS Plugin' },
);
