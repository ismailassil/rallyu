import { JsMsg, Msg, NatsError } from 'nats';
import { app as fastify } from '../app.js';
import { UpdateNotificationPayload } from '../types/notification.types.js';

export async function handleUpdateNotif(m: JsMsg) {
	fastify.log.info('[NATS] Message Arrived to `notification.update`');

	const payload = fastify.jsCodec.decode(m.data) as UpdateNotificationPayload;

	fastify.log.info(payload);

	const room = payload.userId.toString();

	fastify.io.in(room).emit('notification_update', payload);

}