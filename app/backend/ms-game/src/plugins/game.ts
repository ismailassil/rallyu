import type { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import WebSocket from 'ws'
import type { Room } from '../types/types';
import { createRoomSchema, joinRoomSchema, roomStatusSchema, userStatusSchema } from '../schemas/schemas';
import { roomManager } from '../session/room';

const MS_MATCHMAKING_API_KEY = process.env.MS_MATCHMAKING_API_KEY || 'DEFAULT_MS_MATCHMAKING_SECRET_';
const MS_AUTH_PORT = process.env.MS_AUTH_PORT || '5005'
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || ''

const game = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
	const ROOM_EXPIRATION_TIME = 10000; // 10 sec
    const GAME_TIME = 10000; // 10 seconds
	const userSessions = new Map() // Map<userid, roomid>


	fastify.decorate('json', (socket: WebSocket.WebSocket, obj: any): void => {
		if (socket?.readyState === WebSocket.OPEN)
			socket.send(JSON.stringify(obj))
	})

	const closeRoom = (room: Room<any, any>, code: number, msg: string): void => {
		// test this if players already closed sockets
		room.players.forEach(p => {
			userSessions.delete(p.id);
			if (p.socket?.readyState === WebSocket.OPEN)
				p.socket.close(code, msg);
		})
		room.cleanUp();
		roomManager.deleteRoom(room.id);
	}

	fastify.get('/room/join/:roomid', { websocket: true, schema: joinRoomSchema }, (socket: WebSocket.WebSocket, req: FastifyRequest) => {
		try {
			const { roomid } = req.params as { roomid: string };
			const { user } = req.query as { user : number };
			const sessionId = userSessions.get(user);

			if (sessionId != roomid) 
				throw new Error("Session and room ID mismatch");

			const room = roomManager.getRoom(roomid);
			if (!room)
				throw new Error("Match room not found");

			const player = room.players.find(player => player.id === user);
			if (!player)
				throw new Error("Player not in match room");
			if (player.connected)
				throw new Error("A connection already exits");

			player.attachSocket(socket);
			if (room.running) {
				const index = room.players.indexOf(player);
				player.setupEventListeners(room);
				if (room.players[index ^ 1].socket?.readyState === WebSocket.OPEN)
					room.players[index ^ 1].socket!.send(JSON.stringify({type: 'opp_joined'}))

				if (player.socket?.readyState === WebSocket.OPEN) {
					player.socket!.send(JSON.stringify({
						type: 'reconnected',
						score: room.state.score,
						i: index,
						time: Math.round((GAME_TIME - (Date.now() - room.startTime!)) / 1000)
					}));
				}
			} else if (room.players.every(p => p.connected)) {
				clearTimeout(room.expirationTimer!);
				room.gameTimerId = setTimeout(async () => {
					room.sendGameOverPacket();
					closeRoom(room, 1003, 'Game Over');
					// await axios.post(`http://ms-auth:${MS_AUTH_PORT}/users/match`, {
					// 	players: [
					// 		{ 
					// 			ID: room.players[0].id, 
					// 			score: room.state.score[0]
					// 		},
					// 		{
					// 			ID: room.players[1].id, 
					// 			score: room.state.score[1]
					// 		}
					// 	],
					// 	gameStartedAt: room.startTime,
					// 	gameFinishedAt: Math.floor(Date.now() / 1000)
					// });
				}, GAME_TIME);
				room.startGame();
			}

			socket.on('close', player.detachSocket);
		} catch (e) {
			const err = e as Error;
			console.error("Match room error: ", err);
			
			return socket.close(1001, `Access denied: ${err.message}`);
		}
	})

	fastify.get('/user/status/:userid', { schema: userStatusSchema }, (req, res) => {
		const { user } = req.params as { user: number };
		const session = userSessions.get(user);
		if (!session){
			return res.code(404).send({
				message: 'user not currently on an active game.'
			})
		}
		const opponentId = roomManager.getRoom(session)?.players?.find(player => player.id !== user)?.id;
	
		return {
			roomId: session,
			opponentId
		};
	})

	fastify.get('/room/status/:roomid', { schema: roomStatusSchema }, (req, res) => {
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
		const auth = (req.headers.authorization as string).startsWith('Bearer ')
            ? (req.headers.authorization as string).slice(7)
            : (req.headers.authorization as string);

		// add auth check with jwt here
		if (auth !== MS_MATCHMAKING_API_KEY)
			return res.code(401);

		const { playersIds, gameType, gameMode } = req.body as { playersIds: number[], gameType: string, gameMode: string };
		if (!playersIds) {
			return res.code(400).send({
				message: 'players ids not provided.'
			})
		}

		if (userSessions.get(playersIds[0]) || userSessions.get(playersIds[1])) {
			return res.code(403).send({
				message: 'player already in game'
			})
		}

		const { roomid, room }  = roomManager.createRoom(gameType, gameMode);
		room.attachPlayers(playersIds);

		room.expirationTimer = setTimeout(() => {
			closeRoom(room, 1002, "Match room expired");
		}, ROOM_EXPIRATION_TIME)

		playersIds.forEach(id => {
			userSessions.set(id, roomid);
		})
		return { roomid };
	})
}

export default game;