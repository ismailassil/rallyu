import type { JsMsg } from "nats";
import { app as fastify } from "../app.js";

interface NotificationPayload {
	sockets?: string[];
	userId: number;
	load: any;
}

export function handleOutgoingNotification(m: JsMsg) {
	fastify.log.info("[NATS] Message Arrived to `notification`");
	const payload = fastify.jsCodec.decode(m.data) as NotificationPayload;

	if (payload.sockets) {
		fastify.io.to(payload.sockets).emit("notification", payload.load);
	} else {
		fastify.io.in(payload.userId.toString()).emit('notification', payload.load);
	}
}
