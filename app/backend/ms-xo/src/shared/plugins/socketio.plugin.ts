import fp from 'fastify-plugin';
import { Server } from 'socket.io';
import { FastifyInstance } from 'fastify';
import GameService from '../../services/GameService';
import { randomUUID } from 'crypto';

const games = new Map<string, GameService>();

// TODO: Change this to nats pub/sub
const socketPlugin = fp(async (fastify: FastifyInstance) => {
	const io = new Server(fastify.server, {
		cors: { origin: '*' },
	});

	fastify.log.info('[SocketIO] Server is Up and Running');

	function setupTimer(gameId: string, game: GameService) {
		const tick = (timeLeft: number) => {
			io.to(gameId).emit('timeLeft', { timeLeft });
		};
		const timeout = (data: any) => {
			io.to(gameId).emit('gameUpdate', data);
		};
		game.onTick(tick, timeout);
	}

	io.on('connection', (socket) => {
		fastify.log.info(`Client connected: ${socket.id}`);

		socket.on('createGame', ({ plType }, callback) => {
			const gameId = randomUUID();
			const game = new GameService(gameId, 'local', 3);

			games.set(gameId, game);
			socket.join(gameId);

			setupTimer(gameId, game);
			
			callback(game.getState());
		});
		
		socket.on('play', ({ gameId, index }) => {
			const game = games.get(gameId);
			if (!game) return;
			
			const result = game.play(index);
			
			if (result.status === 'going') {
				setupTimer(gameId, game);
			}
			io.to(gameId).emit('gameUpdate', result);
		});
		
		socket.on('nextRound', ({ gameId }, callback) => {
			const game = games.get(gameId);
			if (!game) return;
			
			setupTimer(gameId, game);
			callback(game.nextRound());
		});

		socket.on('state', (gameId) => {
			const game = games.get(gameId);
			if (!game) return;

			io.to(gameId).emit('updateState', game.getState());
		});

		socket.on('disconnect', () => {
			fastify.log.info(`Client disconnected: ${socket.id}`);
		});
	});

	fastify.decorate('io', io);
});

export default socketPlugin;
