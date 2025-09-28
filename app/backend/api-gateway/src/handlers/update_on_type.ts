import type { JsMsg } from 'nats';
import { app as fastify } from '../app.js';
import type { UPDATE_ON_TYPE_PAYLOAD } from '../types/notification.types.js';

export async function handleUpdateNotifOnType(m: JsMsg) {
	fastify.log.info('[NATS] Message Arrived to `notification.update_on_type`');

	const payload = fastify.jsCodec.decode(m.data) as UPDATE_ON_TYPE_PAYLOAD;

	fastify.log.info(payload);

	const senderRoom = payload.userId.toString();

	fastify.log.info(senderRoom);

	fastify.io.in(senderRoom).emit('notification_update_on_type', payload.data);
}
