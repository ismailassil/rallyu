import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Server as SocketIOServer } from 'socket.io';
import { IChatPayload, socketioOpts } from './socketio.types';
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
		const userId = socket.data.userId;
		fastify.log.info(`[SocketIO] Client Connected: '${userId}:${socket.id}'`);

		if (!socket.rooms.has(userId)) {
			fastify.nats.publish(
				'socket.connected',
				fastify.jsCodec.encode({
					userId: userId,
				}),
			);
		}
		await socket.join(socket.data.username);

		// Chat Events
		socket.on('send_msg', async (data: IChatPayload) => {
			fastify.js.publish(
				fastify.chatSubj.replace('*', '') + 'send_msg',
				fastify.jsCodec.encode(data),
				{ headers: fastify.headerReplyTo },
			);

			/***
			 * When the User sends a message to a friend and has multiple sessions opened, 
			 * send it to all sessions!
			 * with new info (id, and other)
			 * `socket.to(socket.data.username).except(socket.id).emit('send_msg', data);`
			 */
		});

		socket.on('disconnecting', async () => {
			const userId = socket.data.userId;

			fastify.log.info(
				`[SocketIO] Client Disconnected: '${userId}:${socket.id}'`,
			);

			await socket.leave(userId);

			if (!socket.rooms.has(userId)) {
				fastify.nats.publish(
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

			socket.data.userId = res.sub;

			next();
		} catch (error) {
			fastify.log.error('[SocketIO] Error: ' + (error as Error).message);
			socket.disconnect();
			next(new Error('Unauthorized'));
		}
	});
});
