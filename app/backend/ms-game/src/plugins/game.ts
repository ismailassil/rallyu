import type { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import WebSocket from 'ws'
import type { GameType } from '../types/types';
import { createRoomSchema, joinRoomSchema, roomStatusSchema, userStatusSchema } from '../schemas/schemas';
import { roomManager, userSessions, closeRoom } from '../room/roomManager';
import apiInterface from './interface';

const game = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
	const ROOM_EXPIRATION_TIME = 30000; // 30 sec

	fastify.register(apiInterface, { prefix: '/interface' });

	fastify.get('/room/join/:roomid', { websocket: true, schema: joinRoomSchema }, (socket: WebSocket.WebSocket, req: FastifyRequest) => {
		try {
			const { roomid } = req.params as { roomid: string };
			const { userid } = req.query as { userid : number };
			const sessionId = userSessions.get(userid);

			if (sessionId != roomid) 
				throw new Error("1");

			const room = roomManager.getRoom(roomid);
			if (!room)
				throw new Error("2");

			const player = room.players.find(player => player.id === userid);

			if (!player)
				throw new Error("3");

			if (player.connected) {
				player.socket?.removeAllListeners('close');
				player.socket?.close(1003, 'error_code_4');
				player.detachSocket();
			}

			player.attachSocket(socket);
			if (room.running) {
				room.reconnect(player);
			} else if (room.players.every(p => p.connected)) {
				clearTimeout(room.expirationTimer!);
				room.startGame();
			}

			socket.on('close', player.detachSocket);
		} catch (e) {
			const err = e as Error;
			console.error("Match room error: ", err);

			return socket.close(1001, `error_code_${err.message}`);
		}
	})

	fastify.get('/user/:userid/status', { schema: userStatusSchema }, (req, res) => {
		const { userid } = req.params as { userid: number };
		const session = userSessions.get(userid);
		if (!session){
			return res.code(404).send({
				message: 'user not currently on an active game.'
			})
		}
		const room = roomManager.getRoom(session);
		const opponentId = room!.players?.find(player => player.id !== userid)?.id;
	
		return {
			roomId: session,
			opponentId,
			gameType: room!.gameType,
			connected: room?.players.find(p => p.id === userid)?.connected
		};
	})

	fastify.get('/room/:roomid/status', { schema: roomStatusSchema }, (req, res) => {
		const { roomid } = req.params as { roomid: string };
		const room = roomManager.getRoom(roomid);
		if (!room) {
			return res.code(404).send({
				message: 'no active rooms with the specified ID currently active'
			})
		}
		return res.send(room.getStatus());
	})

	fastify.post('/room/create', { schema: createRoomSchema}, (req, res) => {
		const { playersIds, gameType, tournament } = req.body as { playersIds: number[], gameType: GameType, tournament: { gameId: number, tournamentURL: number } };
		const tournGameId = tournament?.gameId;
		const tournURL = tournament?.tournamentURL;

		if (!playersIds) {
			return res.code(400).send({
				message: 'players ids not provided.'
			})
		}

		if (playersIds.some(id => userSessions.get(id))) {
			console.log('403 player already in game');
			return res.code(403).send({
				message: 'player already in game'
			})
		}

		const { roomid, room }  = roomManager.createRoom(gameType, tournGameId, tournURL);
		room.attachPlayers(playersIds);

		room.expirationTimer = setTimeout(() => {
			console.log('Match Room Expired!');
			closeRoom(room, 1002, "error_code_5");
		}, ROOM_EXPIRATION_TIME)

		playersIds.forEach(id => {
			userSessions.set(id, roomid);
		})
		return { roomId: roomid };
	})
}

export default game;