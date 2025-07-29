import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { connect, JSONCodec, NatsConnection } from 'nats';
import NotifSerives from '../../services/notif.services.js';
import { NatsOpts } from '../types/nats.types.js';
import NotificationPayload from '../types/notifications.types.js';

export const natsPlugin = fp(async (fastify: FastifyInstance, opts: NatsOpts) => {
	const notifServices = new NotifSerives();

	const nats: NatsConnection = await connect({
		// servers: 'nats://nats:${opts.NATS_PORT}',
		servers: opts.NATS_URL || 'nats://localhost:4222', // TODO: Change this to Nats container name
		user: opts.NATS_USER,
		pass: opts.NATS_PASSWORD,
		name: 'Notification',
	});

	fastify.log.info('[NATS] Server Connection Established');

	const jc = JSONCodec();

	fastify.decorate('jc', jc);

	nats.subscribe('notify', {
		async callback(err, msg) {
			if (err) {
				fastify.log.error(err);
				return;
			}

			const payload = jc.decode(msg.data) as NotificationPayload;

			try {
				await notifServices.createAndDispatchNotification(payload);
			} catch (err) {
				fastify.log.error(err);
			}
		},
	});

	fastify.decorate('nats', nats);

	fastify.addHook('onClose', async () => {
		try {
			await nats.drain();
			fastify.log.info('[NATS] Server Closed Successfully');
		} catch (error) {
			fastify.log.error(error);
		}
	});
});
