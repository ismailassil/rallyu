import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { connect, JSONCodec, NatsConnection, ErrorCode } from 'nats';
import { NatsOpts } from '../types/nats.types.js';
import {
	NOTIFY_USER_PAYLOAD,
	UPDATE_NOTIFICATION_PAYLOAD,
	UPDATE_STATUS_PAYLOAD,
} from '../types/notifications.types.js';

export const natsPlugin = fp(async (fastify: FastifyInstance, opts: NatsOpts) => {
	const notifServices = fastify.notifService;

	const nats: NatsConnection = await connect({
		// servers: 'nats://nats:${opts.NATS_PORT}',
		servers: opts.NATS_URL || 'nats://localhost:4222', // TODO: Change this to Nats container name
		user: opts.NATS_USER,
		pass: opts.NATS_PASSWORD,
		name: 'Notification',
	});

	fastify.log.info('[NATS] Server Connection Established');

	const jc = JSONCodec();
	const js = nats.jetstream();

	fastify.decorate('jc', jc);
	fastify.decorate('nats', nats);

	const consumer = await js.consumers.get(
		'notificationStream',
		'notificationConsumer',
	);

	(async () => {
		const iter = await consumer.consume();

		for await (const m of iter) {
			/**********************************
			 * SUBJECT: `notification.*`
			 * AVAILABLE:
			 * 		`notification.dispatch`
			 * 		`notification.update`
			 * 		`notification.update_status`
			 */

			try {
				if (m.subject.includes('dispatch')) {
					const payload = jc.decode(m.data) as NOTIFY_USER_PAYLOAD;
					const storedAt = m.info.timestampNanos;
					await notifServices.createAndDispatchNotification(
						payload,
						storedAt,
					);
				} else if (m.subject.includes('update')) {
					const payload = jc.decode(m.data) as UPDATE_NOTIFICATION_PAYLOAD;
					await notifServices.updateAndDispatchNotification(payload);
				} else if (m.subject.includes('update_status')) {
					const payload = jc.decode(m.data) as UPDATE_STATUS_PAYLOAD;
					await notifServices.updateAndDispatchStatus(payload);
				}
			} catch (err) {
				if (err instanceof Error) {
					fastify.log.error('[NATS] NO RESPONDERS ' + err);
				}
			}

			m.ack();
		}
	})();

	fastify.addHook('onClose', async () => {
		try {
			await nats.drain();
			fastify.log.info('[NATS] Server Closed Successfully');
		} catch (error) {
			fastify.log.error(error);
		}
	});
});
