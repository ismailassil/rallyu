import fastifyPlugin from 'fastify-plugin';
import { connect, JSONCodec } from 'nats';

// ** FROM Frontend - data that you will receive [event: chat_send_msg] emit
// export interface MessageType {
// 	senderId: number;
// 	receiverId: number;
// 	text: string;
// }

// ** TO RETURN [event: chat_send_msg, chat_update_msg] on
// data that you should return
// export interface ChatPayload {
// 	id: number;
// 	senderId: number;
// 	receiverId: number;
// 	text: string;
// 	created_at: Date;
// }

async function natsPlugin(fastify, options) {
	const { NATS_URL, NATS_USER, NATS_PASSWORD } = options;

	try {
		const nc = await connect({
			servers: NATS_URL,
			user: NATS_USER,
			pass: NATS_PASSWORD,
			name: 'Chat',
			maxReconnectAttempts: -1,
			reconnectTimeWait: 2000,
		});

		fastify.decorate("nats", nc);
		// ** Encoder and Decoder
		const jsCodec = JSONCodec();

		fastify.decorate("jc", jsCodec);
		// ** This is a JetStream Client
		const js = nc.jetstream();

		const streamName = 'chatStream';
		const consumerName = 'chatConsumer';

		// ** Get the Consumer from the NATS Server
		const consumer = await js.consumers.get(streamName, consumerName);
		fastify.log.info('[NATS] Consumer found');

		(async () => {
			const iter = await consumer.consume();

			for await (const m of iter) {
				fastify.log.info(m.subject);

				const data = jsCodec.decode(m.data);
				fastify.log.info(data);

				////////////////////////////////////////////////
				////////////////////////////////////////////////
				////////////////// HNA LKHEDMA
				////////////////////////////////////////////////
				////////////////////////////////////////////////
				const stmt = fastify.db.prepare(
					'INSERT INTO message (senderId, receiverId, text) VALUES (?, ?, ?) RETURNING *',
				);
				const result = stmt.get(data.senderId, data.receiverId, data.text);

				const textValue = String(data.text);
				if (textValue.length > 300) {
					throw new Error('Message text too long');
				}

				// fastify.log.info("RESULT=============")
				// fastify.log.info(result)

				////////////////////////////////////////////////
				////////////////////////////////////////////////
				////////////////////////////////////////////////
				////////////////////////////////////////////////
				////////////////////////////////////////////////
				////////////////////////////////////////////////
				const res = jsCodec.encode(result);

				////////////////////////////////////////////////
				// ** SEND TO THE NOTIFICATION MICROSERVICE CENTER
				////////////////////////////////////////////////
				const notifData = {
					senderId: result.senderId,
					receiverId: result.receiverId,
					type: 'chat',
					message: result.text,
				};
				js.publish('notification.dispatch', jsCodec.encode(notifData));
				////////////////////////////////////////////////
				////////////////////////////////////////////////
				////////////////////////////////////////////////

				////////////////////////////////////////////////
				/// ** TO REPLY (SEND TO BOTH USERS)
				////////////////////////////////////////////////
				js.publish('gateway.chat.update_msg', res);
				js.publish('gateway.chat.receive_msg', res);
				////////////////////////////////////////////////
				////////////////////////////////////////////////

				/// ! This is NECESSARY to confirm that the message has arrived
				m.ack();
			}
		})();

		fastify.decorate('nc', nc);
	} catch (error) {
		fastify.log.error(error);
	}
}

export default fastifyPlugin(natsPlugin);