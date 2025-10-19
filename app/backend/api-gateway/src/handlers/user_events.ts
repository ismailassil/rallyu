import type { JsMsg } from "nats";
import { app as fastify } from "../app.js";

interface UserEventPayload {
	eventType: string;
	recipientUserIds: number[];
	data: Record<string, any>;
}

export function handleUserEvents(m: JsMsg) {
	fastify.log.info("[NATS] Message Arrived to `user`");
	const event = fastify.jsCodec.decode(m.data) as UserEventPayload;

	for (const userId of event.recipientUserIds) {
		fastify.io.in(userId.toString()).emit('user', {
			eventType: event.eventType,
			data: event.data
		});
	}
}
