import type { JsMsg } from "nats";
import { app as fastify } from "../app.js";

interface UPDATE_GAME_DATA {
	socket_1: string;
	socket_2: string;
	roomId: string;
}

export async function handleUpdateNotifGame(m: JsMsg) {
	fastify.log.info("[NATS] Message Arrived to `notification.update_on_type`");

	const payload = fastify.jsCodec.decode(m.data) as UPDATE_GAME_DATA;

	fastify.log.info(payload);

	const { socket_1, socket_2, roomId } = payload;

	fastify.io.to([socket_1, socket_2]).emit("notification_game_init", roomId);
}
