import type { FastifyInstance } from "fastify";
import { Server, Socket } from "socket.io";
import type { socketioOpts } from "@/plugin/socketio/socketio.types.js";
import type { JWT_ACCESS_PAYLOAD } from "@/types/jwt.types.js";
import type { MessageType } from "@/types/chat.types.js";
import socketRateLimiter from "@/plugin/socketio-rate-limiter/RateLimiter.js";

class SocketIOService {
	private readonly io: Server;
	private readonly fastify: FastifyInstance;
	private readonly options: socketioOpts;

	private onlineUsers = new Map<string, number>();

	constructor(fastify: FastifyInstance, opts: socketioOpts) {
		this.fastify = fastify;
		this.options = opts;

		this.io = new Server(fastify.server, {
			path: "/socketio-api",
			cors: {
				origin: ["https://localhost", "/^https://e[1-3]r[1-9]{1,2}p[1-9]{1,2}.1337.ma$/"],
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
			socket.use(socketRateLimiter({ maxBurst: 80, perSecond: 1 }));

			await this.handleConnection(socket);

			socket.on("chat_send_msg", async (data: MessageType) => {
				this.handleChat(socket, data);
			});

			socket.on("notification", async (data: any) => {
				this.handleIncomingNotification(socket, data);
			});

			socket.on("disconnecting", async () => {
				await this.handleDisconnection(socket);
			});
		});
	}

	private handleChat(socket: Socket, data: MessageType) {
		this.fastify.log.info("[CLIENT][CHAT] RECEIVED MSG");
		this.fastify.log.info(data);
		this.fastify.js.publish("chat.send_msg", this.fastify.jsCodec.encode(data));
	}

	private handleIncomingNotification(socket: Socket, data: any) {
		this.fastify.log.info("[CLIENT][NOTIFICATION] RECEIVED MSG");

		const payload = {
			userId: socket.data.userId,
			userSocket: socket.id,
			load: data,
		};
		this.fastify.js.publish("notification.gateway", this.fastify.jsCodec.encode(payload));
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

	// private async handleRequestOnlineUsersState(socket: Socket) {

	// }

	private async handleOnlineStatus(socket: Socket) {
		const userId: string = socket.data.userId;
		// this.fastify.log.info(`[SocketIO] User is online: '${userId}:${socket.id}'`);

		// add him to online map
		const currentCount = this.onlineUsers.get(userId) || 0;
		this.onlineUsers.set(userId, currentCount + 1);

		// if first connection notify other users
		if (currentCount === 0) socket.broadcast.emit("is_online", { userId });

		// send a full list as first status
		socket.on("request_online_users_list", () => {
			socket.emit("online_users_list", Array.from(this.onlineUsers.keys()));
		});
	}

	private async handleOfflineStatus(socket: Socket) {
		const userId: string = socket.data.userId;
		// this.fastify.log.info(`[SocketIO] User is offline: '${userId}:${socket.id}'`);

		// remove him from online map
		const currentCount = this.onlineUsers.get(userId) || 0;
		const newCount = Math.max(0, currentCount - 1);

		if (newCount === 0) {
			// user has no more connections
			this.onlineUsers.delete(userId);
			// notify all that this user went offline
			this.io.emit("is_offline", { userId });
		} else {
			// user has other connections
			this.onlineUsers.set(userId, newCount);
		}
	}

	private setupMiddleware() {
		this.io.use((socket: Socket, next) => {
			const jwtToken = socket.handshake.auth.token;

			try {
				const res = this.fastify.jwt.verify(jwtToken) as JWT_ACCESS_PAYLOAD;

				socket.data.userId = res.sub.toString();
				if (!socket.data.userId) {
					throw new Error("userId missing");
				}

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
