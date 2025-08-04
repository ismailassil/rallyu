import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { socketioOpts } from './socketio.types';
import SocketIOService from '../../services/SocketIOService.js';

export const socketioPlugin = fp(async function (
	fastify: FastifyInstance,
	opts: socketioOpts,
) {
	try {
		const socketIO = new SocketIOService(fastify, opts);

		socketIO.setupDecorators();
		socketIO.setupConnection();

		fastify.addHook('onClose', async (fastify) => {
			await fastify.io.close();
			fastify.log.info('[SocketIO] Server Closed Successfully');
		});

	} catch (error) {
		fastify.log.error(error);
	}
});
