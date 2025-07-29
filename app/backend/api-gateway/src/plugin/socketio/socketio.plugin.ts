import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Server as SocketIOServer } from 'socket.io';
import { IChatPayload, socketioOpts } from './socketio.types';
import { DecodedPayload } from '../../types/jwt.types';

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
				// credentials: true // TODO: Enable this for secure connection
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
		const username = socket.data.username;
		fastify.log.info(`[SocketIO] Client Connected: '${username}:${socket.id}'`);

		if (!socket.rooms.has(username)) {
			fastify.nats.publish(
				'socket.connected',
				fastify.jsCodec.encode({
					username: username,
				}),
			);
		}
		await socket.join(socket.data.username);

		socket.on('send_msg', async (data: IChatPayload) => {
			fastify.js.publish(
				fastify.chatSubj.replace('*', '') + 'send_msg',
				fastify.jsCodec.encode(data),
				{ headers: fastify.headerReplyTo },
			);

			/***
			 * When the User sends a message to a friend and has multiple sessions opened, send it to all sessions!
			 * with new info (id, and other)
			 * `socket.to(socket.data.username).except(socket.id).emit('send_msg', data);`
			 */
		});

		socket.on('disconnecting', async () => {
			const username = socket.data.username;

			fastify.log.info(
				`[SocketIO] Client Disconnected: '${username}:${socket.id}'`,
			);

			await socket.leave(username);

			if (!socket.rooms.has(username)) {
				fastify.nats.publish(
					'socket.disconnected',
					fastify.jsCodec.encode({
						username: username,
					}),
				);
			}
		});
	});

	// ! DOCS
	// Socket Middleware that verifies the User Identity
	fastify.io.use((socket, next) => {
		// TODO - Retrieve the TOKEN only from the AUTH
		const jwtToken =
			socket.handshake.auth.token ?? socket.handshake.headers.token;

		try {
			const res = fastify.jwt.verify(jwtToken) as DecodedPayload;
			socket.data.username = res.username;

			next();
		} catch (error) {
			fastify.log.error('[SocketIO] Error: ' + (error as Error).message);
			socket.disconnect();
			next(new Error('Unauthorized'));
		}
	});
});
