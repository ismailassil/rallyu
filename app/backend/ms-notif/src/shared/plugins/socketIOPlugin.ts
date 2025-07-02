import fp from 'fastify-plugin';
import { IMessage } from '../types/notifMessage.types';
import { FastifyInstance } from 'fastify';

const socketIOPlugin = fp(async function (fastify: FastifyInstance) {
	fastify.decorate('connectedUsers', new Map<string, string>());

	fastify.io.on('connection', (socket) => {
		fastify.log.info('User Connected with ID: ' + socket.id);
		socket.on('identify', (message: IMessage) => {
			fastify.connectedUsers.set(socket.id, message.username);
			fastify.log.info([...fastify.connectedUsers.values()].join(', '));
		});

		socket.on('disconnect', () => {
			const user = fastify.connectedUsers.get(socket.id);
			fastify.connectedUsers.delete(socket.id);
			fastify.log.info(`User disconnected: ${user} - ${socket.id}`);
			fastify.log.info([...fastify.connectedUsers.values()].join(', '));
		});
	});
});

export default socketIOPlugin;
