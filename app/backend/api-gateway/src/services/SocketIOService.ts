import type { FastifyInstance } from "fastify";
import { Server, Socket } from "socket.io";
import type { socketioOpts } from "@/plugin/socketio/socketio.types.js";
import type { JWT_ACCESS_PAYLOAD } from "@/types/jwt.types.js";
import type { MessageType } from "@/types/chat.types.js";
import type {
	UPDATE_GAME_DATA,
	UPDATE_GAME_PAYLOAD,
	UPDATE_NOTIFICATION_DATA,
	UPDATE_ON_TYPE_DATA,
	UPDATE_ON_TYPE_PAYLOAD,
} from "@/types/notification.types.js";

class SocketIOService {
	private readonly io: Server;
	private readonly fastify: FastifyInstance;
	private readonly options: socketioOpts;

	private onlineUsersIDs = new Set<string>;

	constructor(fastify: FastifyInstance, opts: socketioOpts) {
		this.fastify = fastify;
		this.options = opts;

		this.io = new Server(fastify.server, {
			path: "/socketio-api",
			cors: {
				// origin: `http://localhost:${this.options.FRONT_PORT}`,
				origin: "*",
				methods: ["GET", "POST"],
				credentials: true,
			},
			transports: ["polling"],
		});

		fastify.log.info("[SocketIO] Server is Running");

		this.setupMiddleware();
	}

	public setupDecorators(): void {
		this.fastify.decorate("io", this.io);
	}

	public setupConnection(): void {
		this.io.on("connection", async (socket: Socket) => {
			await this.handleConnection(socket);

			socket.on("chat_send_msg", async (data: MessageType) => {
				this.handleChat(socket, data);
			});

			socket.on("notification_update_action", async (data: UPDATE_NOTIFICATION_DATA) => {
				this.handleNotificationUpdateAction(socket, data);
			});

			socket.on("notification_update_on_type", async (data: UPDATE_ON_TYPE_DATA) => {
				this.handleNotificationUpdateOnType(socket, data);
			});

			socket.on("notification_start_game", async (data: UPDATE_GAME_DATA) => {
				this.handleNotificationStartGame(socket, data);
			});

			socket.on("notification_update_game", async (data: UPDATE_GAME_DATA) => {
				this.handleNotificationUpdateGame(socket, data);
			});

			socket.on("disconnecting", async () => {
				await this.handleDisconnection(socket);
			});
		});
	}

	private handleNotificationStartGame(socket: Socket, data: UPDATE_GAME_DATA) {
		this.fastify.log.info("[CLIENT][START_GAME] RECEIVED MSG");
		this.fastify.log.info(data);
		const payload = this.fastify.jsCodec.encode({
			sender: {
				userId: data.senderId,
				userSocket: socket.id,
			},
			receiver: {
				userId: data.receiverId,
			},
			status: "unread",
			type: "game",
		});
		this.fastify.js.publish("notification.start_game", payload);
	}

	private handleNotificationUpdateGame(socket: Socket, data: UPDATE_GAME_DATA) {
		this.fastify.log.info("[CLIENT][UPDATE_GAME] RECEIVED MSG");
		this.fastify.log.info(data);
		const payload = this.fastify.jsCodec.encode({
			sender: {
				userId: data.senderId,
				userSocket: socket.id,
			},
			receiver: {
				userId: data.receiverId,
			},
			status: data.status,
			actionUrl: data.actionUrl,
			stateAction: data.stateAction,
			type: "game",
		});
		this.fastify.js.publish("notification.update_game", payload);
	}

	private handleChat(socket: Socket, data: MessageType) {
		this.fastify.log.info("[CLIENT][CHAT] RECEIVED MSG");
		this.fastify.log.info(data);
		this.fastify.js.publish("chat.send_msg", this.fastify.jsCodec.encode(data));
	}

	private handleNotificationUpdateAction(socket: Socket, data: UPDATE_NOTIFICATION_DATA) {
		this.fastify.log.info("[CLIENT][NOTIF] RECEIVED MSG");
		this.fastify.log.info(data);

		const payload = {
			userId: socket.data.userId,
			data: data,
		};

		this.fastify.js.publish("notification.update_action", this.fastify.jsCodec.encode(payload));
	}

	private handleNotificationUpdateOnType(socket: Socket, data: UPDATE_ON_TYPE_DATA) {
		this.fastify.log.info("[CLIENT][NOTIF] RECEIVED MSG");
		this.fastify.log.info(data);

		const payload: UPDATE_ON_TYPE_PAYLOAD = {
			userId: socket.data.userId,
			data: {
				type: data.type,
				state: data.state,
				status: data.status,
			},
		};

		this.fastify.js.publish(
			"notification.update_on_type",
			this.fastify.jsCodec.encode(payload),
		);
	}

	private async handleConnection(socket: Socket) {
		const userId: string = socket.data.userId;
		this.fastify.log.info(`[SocketIO] Client Connected: '${userId}:${socket.id}'`);

		await this.handleOnlineStatus(socket);

		await socket.join(userId);
	}

	private async handleDisconnection(socket: Socket) {
		const userId: string = socket.data.userId;
		this.fastify.log.info(`[SocketIO] Disconnected: '${userId}:${socket.id}'`);

		await this.handleOfflineStatus(socket);

		await socket.leave(userId);
	}

	private async handleOnlineStatus(socket: Socket) {
		const userId: string = socket.data.userId;
		// this.fastify.log.info(`[SocketIO] User is online: '${userId}:${socket.id}'`);

		// add him to online set
		this.onlineUsersIDs.add(userId);

		// send a full list as first status
		socket.emit('online_users_list', Array.from(this.onlineUsersIDs));

		// notify other users that this user in now online
		socket.broadcast.emit('is_online', { userId });
	}

	private async handleOfflineStatus(socket: Socket) {
		const userId: string = socket.data.userId;
		// this.fastify.log.info(`[SocketIO] User is offline: '${userId}:${socket.id}'`);

		// add him to online set
		this.onlineUsersIDs.delete(userId);

		// notify all that this user went offline
		this.io.emit('is_offline', { userId });
	}

	private setupMiddleware() {
		this.io.use((socket: Socket, next) => {
			const jwtToken = socket.handshake.auth.token;

			try {
				const res = this.fastify.jwt.verify(jwtToken) as JWT_ACCESS_PAYLOAD;

				socket.data.userId = res.sub.toString();

				next();
			} catch (error) {
				this.fastify.log.error("[SocketIO] Error: " + (error as Error).message);
				socket.disconnect();
				next(new Error("Unauthorized"));
			}
		});
	}
}

export default SocketIOService;
