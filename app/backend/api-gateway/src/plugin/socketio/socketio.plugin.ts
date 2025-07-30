import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Server as SocketIOServer } from 'socket.io';
import { MessageType } from '../../types/chat.types';
import { socketioOpts } from './socketio.types';
import { JWT_ACCESS_PAYLOAD } from '../../types/jwt.types';

export const socketioPlugin = fp(async function (
	fastify: FastifyInstance,
	opts: socketioOpts,
) {
	try {
		const io = new SocketIOServer(fastify.server, {
			cors: {
				// origin: `http://frontend:${FRONT_PORT}`,
				origin: `http://localhost:${opts.FRONT_PORT}`,
				methods: ['GET', 'POST'],
				credentials: true, // TODO: Enable this for secure connection
			},
		});

		fastify.log.info('[SocketIO] Server is Running');

		fastify.decorate('io', io);

		fastify.addHook('onClose', async (fastify) => {
			await fastify.io.close();
			fastify.log.info('[SocketIO] Server Closed Successfully');
		});
	} catch (error) {
		fastify.log.error(error);
	}

	fastify.io.on('connection', async (socket) => {
		const userId: string = socket.data.userId.toString();
		fastify.log.info(`[SocketIO] Client Connected: '${userId}:${socket.id}'`);

		if (!socket.rooms.has(userId)) {
			fastify.nc.publish(
				'socket.connected',
				fastify.jsCodec.encode({
					userId: userId,
				}),
			);
		}
		await socket.join(socket.data.userId);

		// Chat Events
		socket.on('chat_send_msg', async (data: MessageType) => {
			fastify.log.info('[CLIENT] received msg = ' + data);

			fastify.js.publish('chat.send_msg', fastify.jsCodec.encode(data));
		});

		socket.on('disconnecting', async () => {
			const userId: string = socket.data.userId.toString();

			fastify.log.info(
				`[SocketIO] Client Disconnected: '${userId}:${socket.id}'`,
			);

			await socket.leave(userId);

			if (!socket.rooms.has(userId)) {
				fastify.nc.publish(
					'socket.disconnected',
					fastify.jsCodec.encode({
						userId: userId,
					}),
				);
			}
		});
	});

	// ! DOCS
	// Socket Middleware that verifies the User Identity
	fastify.io.use((socket, next) => {
		const jwtToken = socket.handshake.auth.token;

		try {
			const res = fastify.jwt.verify(jwtToken) as JWT_ACCESS_PAYLOAD;

			socket.data.userId = res.sub.toString();

			next();
		} catch (error) {
			fastify.log.error('[SocketIO] Error: ' + (error as Error).message);
			socket.disconnect();
			next(new Error('Unauthorized'));
		}
	});
});
