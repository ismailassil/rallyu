import type { JsMsg } from 'nats';
import { app as fastify } from '../app.js';
import type { USER_NOTIFICATION_PAYLOAD } from '../types/notification.types.js';

export async function handleNotify(m: JsMsg) {
	fastify.log.info('[NATS] Message Arrived to `notification.notify`');

	const payload = fastify.jsCodec.decode(m.data) as USER_NOTIFICATION_PAYLOAD;

	fastify.log.info(payload);

	const receiverRoom = payload.userId.toString();

	fastify.log.info(receiverRoom);

	fastify.io.in(receiverRoom).emit('notification_notify', payload.data);
}
