import fastify, { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { connect, JSONCodec, NatsConnection } from 'nats';
import NotifSerives from '../../services/notif.services.js';
import { INotifDetail } from '../types/fetch.types';
import INotifyBody from '../types/notifyBody.types';
import { NatsOpts } from '../types/nats.types';

export const natsPlugin = fp(async (fastify: FastifyInstance, opts: NatsOpts) => {
	const notifServices = new NotifSerives();

	const nats: NatsConnection = await connect({
		// servers: 'nats://nats:${opts.NATS_PORT}',
		servers: `nats://localhost:${opts.NATS_PORT}`, // TODO: Change this to Nats container name
		user: opts.NATS_USER,
		pass: opts.NATS_PASSWORD,
		name: 'Notification',
	});

	fastify.log.info('[NATS] Server Connection Established');

	const jc = JSONCodec();

	nats.subscribe('notify', {
		async callback(err, msg) {
			if (err) {
				fastify.log.error(err);
				return;
			}

			const payload: INotifyBody = jc.decode(msg.data) as INotifyBody;

			// Register the notification in the Database
			try {
				const notifId = await notifServices.registerNotification(payload);
				fastify.log.info('✅ Notification created');

				// Get the Data from Redis
				const result = await fastify.redis.get(`notif?id=${notifId}`);
				if (!result) {
					const message = 'Notification not found';
					fastify.log.error(message);
					return;
				}

				// Parse the Notification
				const resData: INotifDetail = JSON.parse(result);

				// Send back to SocketIO Gateway through NATS Server
				fastify.nats.publish(
					'notification',
					jc.encode({
						username: payload.to_user,
						type: 'notify',
						data: resData,
					}),
				);
				try {
					await fastify.nats.flush();
					fastify.log.info('✅ Notification => `Gateway`');
				} catch {
					fastify.log.error('❌ Notification => `Gateway`');
				}

				fastify.log.info('Notification created');
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
