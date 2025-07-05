import fastify, { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Server as SocketIOServer } from 'socket.io';

const FRONT_PORT = process.env.FRONT_PORT;

export const socketioPlugin = fp(async function (fastify: FastifyInstance) {
	fastify.decorate('connectedUsers', new Map<string, Set<string>>());

	try {
		const io = new SocketIOServer(fastify.server, {
			cors: {
				origin: `http://frontend:${FRONT_PORT}`,
				methods: ['GET', 'POST'],
				// credentials: true // TODO: Enable this for secure connection
			},
		});

		fastify.log.info('✅ SocketIO Server is Running');

		fastify.decorate('io', io);

		fastify.addHook('onClose', async (fastify) => {
			await fastify.io.close();
			fastify.log.info('⚾️ SocketIO Closed Successfully');
		});
	} catch (error) {
		fastify.log.error(error);
	}

	function addUserSocket(username: string, socketId: string) {
		if (fastify.connectedUsers.has(username)) {
			fastify.connectedUsers.get(username)?.add(socketId);
		} else {
			fastify.connectedUsers.set(username, new Set([socketId]));
		}
	}

	function removeUserSocket(username: string, socketId: string) {
		const sockets = fastify.connectedUsers.get(username);

		if (!sockets) return;

		if (
			sockets.size === 1 &&
			fastify.connectedUsers.get(username)?.has(socketId)
		) {
			fastify.connectedUsers.delete(username);
			return;
		}
		fastify.connectedUsers.get(username)?.delete(socketId);
	}

	fastify.io.on('connection', (socket) => {
		fastify.log.info(`Client Connected with ID: ${socket.id}`);

		// ! DOCS
		// The user should sent after connection its identity
		// through `username`
		socket.on('identify', async (data) => {
			const username = data.username;

			fastify.log.info(`Client sent his identity '${username}:${socket.id}'`);
			socket.data.username = username;
			addUserSocket(username, socket.id);

			await socket.join(data.username);
		});

		socket.on('disconnecting', async () => {
			const username = socket.data.username;

			fastify.log.info(`👀 '${username}' Disconnected with ID: ${socket.id}`);

			removeUserSocket(username, socket.id);
			await socket.leave(username);
		});
	});

	// ! DOCS
	// Socket Middleware that verifies the User
	fastify.io.use((socket, next) => {
		// TODO: Only used for Testing
		const vToekn = '8)@zNX[3cZ:xfn_';
		const jwtToken =
			socket.handshake.auth.token ?? socket.handshake.headers.token;

		try {
			const res = socket.handshake.auth.token
				? fastify.jwt.verify(jwtToken)
				: jwtToken === vToekn;

			if (res !== true) throw new Error();
			next();
		} catch (error) {
			fastify.log.error(error);
			socket.disconnect();
			next(new Error('Unauthorized'));
		}
	});
});
