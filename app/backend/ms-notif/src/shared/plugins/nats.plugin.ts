import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { connect, JSONCodec, type NatsConnection } from "nats";
import type { NatsOpts } from "../types/nats.types.js";
import type { IncomingGatewayType, NOTIFY_USER_PAYLOAD } from "../types/notifications.types.js";

export const natsPlugin = fp(async (fastify: FastifyInstance, opts: NatsOpts) => {
	const notifServices = fastify.notifService;

	const nats: NatsConnection = await connect({
		servers: opts.NATS_URL || "nats://localhost:4222",
		user: opts.NATS_USER,
		pass: opts.NATS_PASSWORD,
		name: "Notification",
		maxReconnectAttempts: -1,
		reconnectTimeWait: 2000,
	});

	fastify.log.info("[NATS] Server Connection Established");

	const jc = JSONCodec();
	const js = nats.jetstream();

	fastify.decorate("jc", jc);
	fastify.decorate("nats", nats);

	const consumer = await js.consumers.get("notificationStream", "notificationConsumer");

	(async () => {
		const iter = await consumer.consume();

		for await (const m of iter) {
			/**********************************
			 * SUBJECT: `notification.*`
			 * AVAILABLE:
			 * 		`notification.dispatch`
			 * 		`notification.gateway`
			 *
			 *************************************/

			fastify.log.info("[NEW NOTIFICATION] " + m.subject);
			try {
				if (m.subject.endsWith("dispatch")) {
					const payload = jc.decode(m.data) as NOTIFY_USER_PAYLOAD;
					const storedAt = m.info.timestampNanos;
					await notifServices.createAndDispatch(payload, storedAt);
				} else if (m.subject.endsWith("gateway")) {
					const payload = jc.decode(m.data) as IncomingGatewayType;
					const {
						userId,
						load: { eventType, data },
					} = payload;

					if (eventType === "UPDATE_ACTION") {
						await notifServices.updateAndDispatch(userId, data);
					} else if (eventType === "SERVICE_EVENT") {
						await notifServices.handleMicroServicesEvent(data);
					} else if (eventType === "UPDATE_CONTEXT") {
						await notifServices.updateContext(userId, data);
					} else if (eventType === "CREATE_GAME") {
						const { userSocket } = payload;
						await notifServices.createGame(userId, userSocket, data);
					} else if (eventType === "UPDATE_GAME") {
						const { userSocket } = payload;
						await notifServices.updateGame(userId, userSocket, data);
					}
				}
			} catch (err) {
				fastify.log.error("[NATS] " + (err as Error).message);
			}

			m.ack();
		}
	})();

	fastify.addHook("onClose", async () => {
		try {
			await nats.drain();
			fastify.log.info("[NATS] Server Closed Successfully");
		} catch (error) {
			fastify.log.error(error);
		}
	});
});
