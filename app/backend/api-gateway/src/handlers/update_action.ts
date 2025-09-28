import type { JsMsg } from 'nats';
import { app as fastify } from '../app.js';
import type { UPDATE_ACTION_PAYLOAD } from '../types/notification.types.js';

export async function handleUpdateNotifAction(m: JsMsg) {
	fastify.log.info('[NATS] Message Arrived to `notification.update_action`');

	const payload = fastify.jsCodec.decode(m.data) as UPDATE_ACTION_PAYLOAD;

	fastify.log.info(payload);

	const senderRoom = payload.userId.toString();

	fastify.log.info(senderRoom);

	fastify.io.in(senderRoom).emit('notification_update_action', payload.data);
}
