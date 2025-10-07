import fastify from "@/app.js";
import NotifRepository from "@/repositories/notif.repository.js";
import type {
	NOTIFY_USER_PAYLOAD,
	RAW_NOTIFICATION,
	UPDATE_ON_TYPE_PAYLOAD,
	UPDATE_NOTIFICATION_DATA,
	UPDATE_STATUS_PAYLOAD,
	USER_NOTIFICATION,
	UPDATE_ACTION_PAYLOAD,
	UPDATE_GAME_PAYLOAD,
} from "@/shared/types/notifications.types.js";
import { millis } from "nats";
import { randomUUID } from "node:crypto";

enum GATEWAY_SUBJECTS {
	NOTIFY = "gateway.notification.notify",
	UPDATE_ACTION = "gateway.notification.update_action",
	UPDATE_ON_TYPE = "gateway.notification.update_on_type",
	UPDATE_GAME = "gateway.notification.update_game",
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
	 * @param payload The notification content and metadata. Should match the `NOTIFY_USER_PAYLOAD` type.
	 * @param timestamp The creation time of the notification, in nanoseconds.
	 *
	 * @returns A Promise that resolves once the notification is created (and possibly dispatched).
	 * @remarks
	 * 1. The notification is first registered in the system.
	 * 2. If the notification is less than 5 minutes old, it's published through NATS to `gateway`
	 * 3. Otherwise, it is only stored but not dispatched.
	 *
	 */
	async createAndDispatchNotification(
		payload: NOTIFY_USER_PAYLOAD,
		timestamp: number,
	): Promise<void> {
		const { receiverId } = payload;

		fastify.log.info("UPDATE ARRIVED");
		fastify.log.info(payload);

		const resData = await this.registerNotification(payload);
		fastify.log.info("✅ Notification created");

		fastify.log.info(resData);

		const data = await this.filterMessage(resData);

		fastify.log.info(data);

		// ********************************* */
		// ** PAYLOAD TO SEND THROUGH `NATS`
		// ********************************* */
		const storedAt = millis(timestamp);
		const currentTime = Date.now();

		const fiveMinutes = 5 * 60 * 1000; // * 5 Minutes

		if (currentTime - storedAt > fiveMinutes) return;

		const resPayload = { userId: receiverId, data };

		const res = fastify.jc.encode(resPayload);
		fastify.nats.publish(GATEWAY_SUBJECTS.NOTIFY, res);
	}

	/**
	 * Updates a user notification and sends it through NATS.
	 *
	 * @param payload The notification content and metadata. Should match the `UPDATE_ACTION_PAYLOAD` type.
	 *
	 * @returns A Promise that resolves once the notification is created and dispatched.
	 * @remarks
	 * 1. The notification is first updated in the system.
	 * 2. Dispatch the notification through NATS to `gateway`
	 *
	 */
	async updateAndDispatchNotification(payload: UPDATE_ACTION_PAYLOAD): Promise<void> {
		const { userId } = payload;

		fastify.log.info(payload.data);

		const ans = await this.updateNotification(userId, payload.data);
		fastify.log.info("✅ NOTIFICATION UPDATED [" + payload.data.status + "]");

		// ********************************* */
		// ** PAYLOAD TO SEND THROUGH `NATS`
		// ********************************* */
		let resPayload: UPDATE_ACTION_PAYLOAD;
		if (ans) {
			resPayload = {
				userId,
				data: {
					updateAll: false,
					notificationId: ans.id,
					status: ans?.status || payload.data.status,
					state: ans?.state || payload.data.state || "pending",
				},
			};
		} else {
			resPayload = {
				userId,
				data: {
					updateAll: true,
					status: payload.data.status,
					state: payload.data.state || "pending",
				},
			};
		}

		const res = fastify.jc.encode(resPayload);
		fastify.nats.publish(GATEWAY_SUBJECTS.UPDATE_ACTION, res);
	}

	async updateNotification(userId: number, payload: UPDATE_NOTIFICATION_DATA) {
		const { updateAll } = payload;

		if (updateAll) {
			const { status } = payload;
			await this.notifRepository.updateAllNotif(userId, status);
		} else {
			const { status, state, notificationId } = payload;

			return await this.notifRepository.updateNotif(
				notificationId,
				userId,
				status,
				state ?? "pending",
			);
		}
	}

	/**
	 * Updates a user notification status.
	 *
	 * Used by microservices
	 *
	 * @param payload The notification content and metadata. Should match the `UPDATE_STATUS_PAYLOAD` type.
	 *
	 * @returns A Promise that resolves once the notification is created (and possibly dispatched).
	 * @remarks
	 * 1. The notification is first updated in the system.
	 * 2. Dispatch the notification through NATS to `gateway`
	 *
	 */
	async updateAndDispatchStatus(payload: UPDATE_STATUS_PAYLOAD): Promise<void> {
		const { senderId, receiverId, status, type } = payload;

		if (type === "friend_request") {
			const { id } = await this.notifRepository.getNotifId(senderId, receiverId, type);

			if (status === "dismissed") {
				await this.notifRepository.removeNotif(id);
			} else {
				await this.notifRepository.updateNotifStatus(id, "finished", "read");
			}

			// ********************************* */
			// ** PAYLOAD TO SEND THROUGH `NATS`
			// ********************************* */
			const resPayload: UPDATE_ACTION_PAYLOAD = {
				userId: receiverId,
				data: {
					updateAll: false,
					notificationId: id,
					status,
					state: "finished",
				},
			};
			fastify.log.info(resPayload);

			const res = fastify.jc.encode(resPayload);
			fastify.nats.publish(GATEWAY_SUBJECTS.UPDATE_ACTION, res);
		} else if (type === "game") {
			if (status === "dismissed") {
				// for timeout
				// Remove the notification
				// Update the notification states on the client side
				return;
			}

			// If the player accepted the game
			// will send the roomId to both
			// Check in the gateway if the messages only to one (for both)
			const roomId = await this.requestRoom([senderId, receiverId]);
		} else if (type === "tournament") {
			/**
			 * TODO - adapt with smoumni
			 */
		}
	}

	async startGame(payload: UPDATE_GAME_PAYLOAD) {
		const {
			sender: { userId: senderId },
			receiver: { userId: receiverId },
		} = payload;

		const resPayload: NOTIFY_USER_PAYLOAD = {
			senderId: senderId,
			receiverId: receiverId,
			type: "game",
			message: payload.sender.userSocket,
			actionUrl: randomUUID(),
		};

		const currentTimestamp: number = new Date().getTime() * 1_000_000;
		fastify.notifService.createAndDispatchNotification(resPayload, currentTimestamp);
		fastify.gameUsers.set(
			senderId,
			setTimeout(() => {
				fastify.notifService.updateGame({
					sender: { userId: senderId },
					receiver: { userId: receiverId },
					status: "dismissed",
					type: "game",
					actionUrl: currentTimestamp.toString(),
				});
			}, 10 * 1000),
		);
	}

	async updateGame(payload: UPDATE_GAME_PAYLOAD) {
		const {
			sender: { userId: senderId },
			receiver: { userId: receiverId },
			status,
			actionUrl,
			stateAction,
		} = payload;
		const { id } = await this.notifRepository.getNotifIdByActionURL(actionUrl || "nothing");

		fastify.log.warn(payload);

		if (status === "dismissed") {
			// FOR TIMEOUT OR REMOVE NOTIF
			fastify.log.warn("DISMISSED");
			await this.notifRepository.updateNotifStatus(id, "finished", "dismissed");

			const resPayload: UPDATE_ACTION_PAYLOAD = {
				userId: receiverId,
				data: {
					updateAll: false,
					notificationId: id,
					status,
					state: "finished",
				},
			};
			const res = fastify.jc.encode(resPayload);
			fastify.nats.publish(GATEWAY_SUBJECTS.UPDATE_ACTION, res);

			if (stateAction === "decline") {
				fastify.log.warn("DECLINE");
				const currentTimestamp: number = new Date().getTime() * 1_000_000;
				const payload: NOTIFY_USER_PAYLOAD = {
					senderId: receiverId,
					receiverId: senderId,
					type: "status",
					message: "decline_game",
				};
				this.createAndDispatchNotification(payload, currentTimestamp);
			}

			return;
		}

		const { content } = await this.notifRepository.getNotifById(id);

		// If the player accepted the Game
		// will send the roomId to Both
		// Check in the gateway if the messages only to one (for both)
		const roomId = await this.requestRoom([senderId, receiverId]);

		fastify.nats.publish(
			GATEWAY_SUBJECTS.UPDATE_GAME,
			fastify.jc.encode({
				socket_1: content,
				socket_2: payload.receiver.userSocket,
				roomId,
			}),
		);
	}

	/**
	 * Updates All Chat Notifications.
	 *
	 * @param payload The notification content and metadata. Should match the `UPDATE_CHAT_PAYLOAD` type.
	 *
	 * @returns A Promise that resolves once the notification is created (and possibly dispatched).
	 * @remarks
	 * 1. All notifications are updated in the system.
	 * 2. Dispatch the notification through NATS to `gateway`
	 *
	 */
	async updateOnType(payload: UPDATE_ON_TYPE_PAYLOAD) {
		const { userId } = payload;
		const { type, state, status } = payload.data;

		// TODO: Reconfigure all the events in the api-gateway and frontend
		await this.notifRepository.updateAllNotifOnType(userId, status, state, type);

		const resPayload: UPDATE_ON_TYPE_PAYLOAD = {
			userId,
			data: { type, status, state },
		};

		const res = fastify.jc.encode(resPayload);
		fastify.nats.publish(GATEWAY_SUBJECTS.UPDATE_ON_TYPE, res);
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

	private async requestRoom(Ids: number[]) {
		const res = await fetch("http://ms-game:5010/game/create-room", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// FIX THIS
				Authorization: `Bearer DEFAULT_MS_MATCHMAKING_SECRET_`,
			},
			body: JSON.stringify({ playersIds: Ids }),
		});

		if (!res.ok) throw new Error(`API "Game service" error: ${res.status}`);

		const { roomId } = (await res.json()) as { roomId: number };

		return roomId;
	}
}

export default NotifSerives;
