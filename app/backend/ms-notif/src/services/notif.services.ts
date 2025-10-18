import fastify from "@/app.js";
import NotifRepository from "@/repositories/notif.repository.js";
import type {
	NOTIFY_USER_PAYLOAD,
	RAW_NOTIFICATION,
	UPDATE_NOTIFICATION_DATA,
	USER_NOTIFICATION,
	UpdateGamePayload,
	MICRO_ACTION_PAYLOAD,
	OutgoingGatewayType,
	UPDATE_CONTEXT_DATA,
	CreateGamePayload,
	GAME_TYPE,
} from "@/shared/types/notifications.types.js";
import { millis } from "nats";
import { randomUUID } from "node:crypto";

enum NOTIF_TYPE {
	NOTIFY = "NOTIFY",
	UPDATE_ACTION = "UPDATE_ACTION",
	UPDATE_CONTEXT = "UPDATE_CONTEXT",
	UPDATE_GAME = "UPDATE_GAME",
}

class NotifSerives {
	private notifRepository: NotifRepository;

	constructor() {
		this.notifRepository = new NotifRepository();
	}

	async getUserMessages(userId: string, page: number): Promise<RAW_NOTIFICATION[]> {
		const data: RAW_NOTIFICATION[] = await this.notifRepository.getMessages(
			parseInt(userId),
			page,
		);

		return data;
	}

	/**
	 * Creates a user notification and sends it through NATS if it's recent.
	 *
	 * @param payload The notification content and metadata.
	 * @param timestamp The creation time of the notification, in nanoseconds.
	 *
	 * @returns A Promise that resolves once the notification is created (and possibly dispatched).
	 * @remarks
	 * 1. The notification is first registered in the system.
	 * 2. If the notification is less than 5 minutes old, it's published through NATS to `gateway`
	 * 3. Otherwise, it is only stored but not dispatched.
	 *
	 */
	async createAndDispatch(payload: NOTIFY_USER_PAYLOAD, timestamp: number): Promise<void> {
		const { receiverId } = payload;

		fastify.log.info("UPDATE ARRIVED");

		const resData = await this.registerNotification(payload);
		fastify.log.info("✅ Notification Created");

		const data = await this.filterMessage(resData);

		// ********************************* */
		// ** PAYLOAD TO SEND THROUGH `NATS`
		// ********************************* */
		const storedAt = millis(timestamp);
		const currentTime = Date.now();

		const fiveMinutes = 5 * 60 * 1000; // * 5 Minutes

		fastify.log.warn(currentTime - storedAt > fiveMinutes);
		if (currentTime - storedAt > fiveMinutes) return;

		const resPayload = { userId: receiverId, load: { eventType: NOTIF_TYPE.NOTIFY, data } };

		fastify.log.warn(resPayload);
		const res = fastify.jc.encode(resPayload);
		fastify.nats.publish("gateway.notification", res);
	}

	/**
	 * Updates a user notification and sends it through NATS.
	 *
	 * @param payload The notification content and metadata.
	 *
	 * @returns A Promise that resolves once the notification is created and dispatched.
	 * @remarks
	 * 1. The notification is first updated in the system.
	 * 2. Dispatch the notification through NATS to `gateway`
	 *
	 */
	async updateAndDispatch(userId: number, payload: UPDATE_NOTIFICATION_DATA): Promise<void> {
		const ans = await this.updateNotification(userId, payload);
		fastify.log.info("✅ NOTIFICATION UPDATED [" + payload.status + "]");

		// ********************************* */
		// ** PAYLOAD TO SEND THROUGH `NATS`
		// ********************************* */
		let resPayload: OutgoingGatewayType;

		if (!payload.updateAll) {
			if (!ans) return;

			resPayload = {
				userId,
				load: {
					eventType: NOTIF_TYPE.UPDATE_ACTION,
					data: {
						updateAll: false,
						notificationId: ans.id,
						status: ans.status,
						state: ans.state,
					},
				},
			};
		} else {
			resPayload = {
				userId,
				load: {
					eventType: NOTIF_TYPE.UPDATE_ACTION,
					data: {
						updateAll: true,
						status: payload.status,
					},
				},
			};
		}

		const res = fastify.jc.encode(resPayload);
		fastify.nats.publish("gateway.notification", res);
	}

	/**
	 *
	 * [A -> B] (users)
	 *
	 * Updates a user notification status [B] and dispatch the notification [A]
	 *
	 * -- Used by microservices
	 *
	 * @param payload The notification content and metadata.
	 *
	 * @returns A Promise that resolves once the notification is created (and possibly dispatched).
	 * @remarks
	 * 1. The notification is first updated in the system.
	 * 2. Dispatch the notification through NATS to `gateway`
	 *
	 */
	async handleMicroServicesEvent(payload: MICRO_ACTION_PAYLOAD): Promise<void> {
		const { senderId, receiverId, load } = payload;

		fastify.log.info(payload);

		if (load.type === "friend_request") {
			const { id } = await this.notifRepository.getNotifId(senderId, receiverId, load.type);
			this.removeAndDispatch(id, receiverId);

			if (load.status === "cancel") return;

			// Notify the user who triggered the friend_request
			const senderPayload: NOTIFY_USER_PAYLOAD = {
				senderId: receiverId,
				receiverId: senderId,
				type: load.status === "accept" ? "friend_accept" : "friend_reject",
			};
			const currentTimestamp: number = new Date().getTime() * 1_000_000;
			this.createAndDispatch(senderPayload, currentTimestamp);
		} else if (load.type === "tournament") {
			/**
			 * TODO - adapt with smoumni
			 */
		}
	}

	/**
	 * Updates All Context Notifications [Chat, Tournament]
	 * - Used when user enters one of the pages.
	 *
	 * @param payload The notification content and metadata.
	 *
	 * @returns A Promise that resolves once the notification is created (and possibly dispatched).
	 * @remarks
	 * 1. All notifications are updated in the system.
	 * 2. Dispatch the notification through NATS to `gateway`
	 *
	 */
	async updateContext(userId: number, payload: UPDATE_CONTEXT_DATA) {
		const { type } = payload;

		// if (status === "dismissed") {
		await this.notifRepository.removeAllNotif(userId, type);
		// } else {
		// 	await this.notifRepository.updateAllNotifOnType(userId, status, state, type);
		// }

		const resPayload: OutgoingGatewayType = {
			userId,
			load: {
				eventType: NOTIF_TYPE.UPDATE_CONTEXT,
				data: { type, status: "dismissed" },
			},
		};

		const res = fastify.jc.encode(resPayload);
		fastify.nats.publish("gateway.notification", res);
	}

	/**
	 * [A -> B] (users)
	 *
	 * Create a Notification and Dispatch it to [B]
	 *
	 * After a period of time, if 10 seconds passed,
	 * make the notification finished for [B]
	 *
	 * */
	async createGame(userId: number, senderSocket: string, payload: CreateGamePayload) {
		const { targetId: receiverId, type } = payload;

		const resPayload: NOTIFY_USER_PAYLOAD = {
			senderId: userId,
			receiverId: receiverId,
			type,
			message: senderSocket,
			actionUrl: randomUUID(),
		};

		const currentTimestamp: number = new Date().getTime() * 1_000_000;
		fastify.notifService.createAndDispatch(resPayload, currentTimestamp);

		fastify.gameUsers.set(
			userId,
			setTimeout(() => {
				fastify.notifService.updateGame(receiverId, "", {
					receiverId: userId,
					type: "game_reject",
					actionUrl: resPayload.actionUrl!,
				});
			}, 10 * 1000),
		);
	}

	async updateGame(userId: number, socketId: string, payload: UpdateGamePayload) {
		const { receiverId, actionUrl, type } = payload;
		const { id } = await this.notifRepository.getNotifIdByActionURL(actionUrl ?? "");

		clearTimeout(fastify.gameUsers.get(userId));
		fastify.gameUsers.delete(userId);

		this.removeAndDispatch(id, userId);
		if (type === "game_reject") return;

		const { content } = await this.notifRepository.getNotifById(id);

		// If the player accepted the Game send both gameType and roomId
		const gameType = type === "pp_game" ? "pingpong" : "tictactoe";
		const roomId = await this.requestRoom([userId, receiverId], gameType);

		fastify.nats.publish(
			"gateway.notification",
			fastify.jc.encode({
				sockets: [content, socketId],
				userId: receiverId,
				load: {
					eventType: NOTIF_TYPE.UPDATE_GAME,
					data: gameType + "/" + roomId,
				},
			} as OutgoingGatewayType),
		);
	}

	async unpackMessages(fullData: RAW_NOTIFICATION[]): Promise<USER_NOTIFICATION[]> {
		return Promise.all(fullData.map(this.filterMessage));
	}

	private async filterMessage(data: RAW_NOTIFICATION): Promise<USER_NOTIFICATION> {
		const cachedAvatar = await fastify.redis.get(`avatar:${data.sender_id}`);
		let avatar;
		if (cachedAvatar !== null) {
			avatar = cachedAvatar;
		} else {
			const res = await fastify.nats.request(
				"user.avatar",
				fastify.jc.encode({ user_id: data.sender_id }),
			);

			avatar = fastify.jc.decode(res.data).avatar_url;
			fastify.redis.setex(`avatar:${data.sender_id}`, 15 * 60, avatar);
		}

		return {
			id: data.id,
			senderId: data.sender_id,
			senderUsername: data.sender_username,
			receiverId: data.receiver_id,
			content: data.content,
			type: data.type,
			createdAt: data.created_at,
			updatedAt: data.updated_at,
			status: data.status,
			state: data.state,
			actionUrl: data.action_url,
			avatar: avatar,
		};
	}

	private async registerNotification(payload: NOTIFY_USER_PAYLOAD): Promise<RAW_NOTIFICATION> {
		const { senderId } = payload;

		const cachedUsername = await fastify.redis.get(`username:${senderId}`);
		let senderUsername;

		if (cachedUsername !== null) {
			senderUsername = cachedUsername;
		} else {
			const senderUser = await fastify.nats.request(
				"user.username",
				fastify.jc.encode({ user_id: senderId }),
			);

			senderUsername = fastify.jc.decode(senderUser.data).username;
		}

		const data: RAW_NOTIFICATION = await this.notifRepository.registerMessage(
			payload,
			senderUsername,
		);

		return data;
	}

	private async requestRoom(Ids: number[], gameType: GAME_TYPE) {
		const res = await fetch("http://ms-game:5010/game/room/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// FIX THIS
				Authorization: `Bearer DEFAULT_MS_MATCHMAKING_SECRET_`,
			},
			body: JSON.stringify({ playersIds: Ids, gameType }),
		});

		if (!res.ok) throw new Error(`API "Game service" error: ${res.status}`);

		const { roomId } = (await res.json()) as { roomId: number };

		return roomId;
	}

	private async updateNotification(userId: number, payload: UPDATE_NOTIFICATION_DATA) {
		const { updateAll, status } = payload;

		if (updateAll === true) {
			await this.notifRepository.updateAllNotif(userId, status);
		} else {
			const { state, notificationId } = payload;

			return await this.notifRepository.updateNotif(
				notificationId,
				userId,
				status,
				state ?? "pending",
			);
		}
	}

	private async removeAndDispatch(NotifId: number, userId: number) {
		await this.notifRepository.removeNotif(NotifId);

		// ********************************* */
		// ** PAYLOAD TO SEND THROUGH `NATS`
		// ********************************* */
		const receiverPayload: OutgoingGatewayType = {
			userId,
			load: {
				eventType: NOTIF_TYPE.UPDATE_ACTION,
				data: {
					updateAll: false,
					notificationId: NotifId,
					status: "dismissed",
					state: "finished",
				},
			},
		};

		// Update the notification on the receiver side
		const res = fastify.jc.encode(receiverPayload);
		fastify.nats.publish("gateway.notification", res);
	}
}

export default NotifSerives;
