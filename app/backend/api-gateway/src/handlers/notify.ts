import { JsMsg, Msg, NatsError } from 'nats';
import { app as fastify } from '../app.js';
import { NotificationPayload } from '../types/notification.types.js';

export async function handleNotify(m: JsMsg) {
	fastify.log.info('[NATS] Message Arrived to `notification.notify`');

	const payload = fastify.jsCodec.decode(m.data) as NotificationPayload;

	fastify.log.info(payload);

	const receiverRoom = payload.recipientId.toString();

	fastify.log.info(receiverRoom);

	fastify.io.in(receiverRoom).emit('notification_notify', payload);
}
