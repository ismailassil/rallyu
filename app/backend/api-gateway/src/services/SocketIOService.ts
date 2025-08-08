import { FastifyInstance } from 'fastify';
import { Server, Socket } from 'socket.io';
import { socketioOpts } from '../plugin/socketio/socketio.types';
import { JWT_ACCESS_PAYLOAD } from '../types/jwt.types';
import { MessageType } from '../types/chat.types';
import { UPDATE_NOTIFICATION_DATA } from '../types/notification.types';

class SocketIOService {
	private readonly io: Server;
	private readonly fastify: FastifyInstance;
	private readonly options: socketioOpts;

	constructor(fastify: FastifyInstance, opts: socketioOpts) {
		this.fastify = fastify;
		this.options = opts;

		this.io = new Server(fastify.server, {
			cors: {
				origin: `http://localhost:${this.options.FRONT_PORT}`,
				methods: ['GET', 'POST'],
				credentials: true,
			},
		});

		fastify.log.info('[SocketIO] Server is Running');

		this.setupMiddleware();
	}

	public setupDecorators(): void {
		this.fastify.decorate('io', this.io);
	}

	public setupConnection(): void {
		this.io.on('connection', async (socket: Socket) => {
			await this.handleConnection(socket);

			socket.on('chat_send_msg', async (data: MessageType) => {
				this.handleChat(socket, data);
			});

			socket.on(
				'notification_update',
				async (data: UPDATE_NOTIFICATION_DATA) => {
					this.fastify.log.info(data);
					this.handleNotificationUpdate(socket, data);
				},
			);

			socket.on('disconnecting', async () => {
				await this.handleDisconnection(socket);
			});
		});
	}

	private handleChat(socket: Socket, data: MessageType) {
		this.fastify.log.info('[CLIENT][CHAT] received msg = ');
		this.fastify.log.info(data);
		
		
		this.fastify.js.publish('chat.send_msg', this.fastify.jsCodec.encode(data));
	}
	
	private handleNotificationUpdate(
		socket: Socket,
		data: UPDATE_NOTIFICATION_DATA,
	) {
		this.fastify.log.info('[CLIENT][NOTIF] received msg = ');
		this.fastify.log.info(data);

		const payload = {
			userId: socket.data.userId,
			data: data,
		};

		this.fastify.js.publish(
			'notification.update',
			this.fastify.jsCodec.encode(payload),
		);
	}

	private async handleConnection(socket: Socket) {
		const userId: string = socket.data.userId;
		this.fastify.log.info(
			`[SocketIO] Client Connected: '${userId}:${socket.id}'`,
		);

		await socket.join(userId);
	}

	private async handleDisconnection(socket: Socket) {
		const userId: string = socket.data.userId;

		this.fastify.log.info(`[SocketIO] Disconnected: '${userId}:${socket.id}'`);

		await socket.leave(userId);
	}

	private setupMiddleware() {
		this.io.use((socket: Socket, next) => {
			const jwtToken = socket.handshake.auth.token;

			try {
				const res = this.fastify.jwt.verify(jwtToken) as JWT_ACCESS_PAYLOAD;

				socket.data.userId = res.sub.toString();

				next();
			} catch (error) {
				this.fastify.log.error(
					'[SocketIO] Error: ' + (error as Error).message,
				);
				socket.disconnect();
				next(new Error('Unauthorized'));
			}
		});
	}
}

export default SocketIOService;
