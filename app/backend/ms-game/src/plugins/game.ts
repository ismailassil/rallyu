import type { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import WebSocket from 'ws'
import jwt from 'jsonwebtoken'
import type { GameType, Room } from '../types/types';
import { createRoomSchema, joinRoomSchema, roomStatusSchema, userStatusSchema } from '../schemas/schemas';
import { roomManager } from '../room/roomManager';
import dotenv from 'dotenv'
dotenv.config();

const MS_MATCHMAKING_API_KEY = process.env.MS_MATCHMAKING_API_KEY || 'DEFAULT_MS_MATCHMAKING_SECRET_';
const MS_AUTH_PORT = process.env.MS_AUTH_PORT || '5005'
const JWT_ACCESS_SECRET = process.env['JWT_ACCESS_SECRET'] || ''

const game = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
	const ROOM_EXPIRATION_TIME = 20000; // 10 sec
    const GAME_TIME = 23000; // 10 seconds
	const userSessions = new Map() // Map<userid, roomid>

	fastify.addHook('preHandler', async (req, res) => {
		let token;
		const authHeader = req.headers.authorization;

		if (authHeader) {
			token = authHeader.startsWith('Bearer ') 
				? authHeader.slice(7)
				: authHeader;
		}
		else if (req.query && (req.query as any).accessToken) {
			token = (req.query as any).accessToken;
		}
	
		if (!token) {
			return res.code(401).send({ message: 'Unauthorized' });
		}
		
		if (token !== MS_MATCHMAKING_API_KEY) {
			try {
				jwt.verify(token, JWT_ACCESS_SECRET, { algorithms: ['HS256'] });
			} catch (err) {
				return res.code(401).send({ message: 'Unauthorized' });
			}
		}
	});

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
			const { userid } = req.query as { userid : number };
			const sessionId = userSessions.get(userid);

			if (sessionId != roomid) 
				throw new Error("Session and room ID mismatch");

			const room = roomManager.getRoom(roomid);
			if (!room)
				throw new Error("Match room not found");

			const player = room.players.find(player => player.id === userid);
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
		const { playersIds, gameType } = req.body as { playersIds: number[], gameType: GameType };
		if (!playersIds) {
			return res.code(400).send({
				message: 'players ids not provided.'
			})
		}

		if (playersIds.some(id => userSessions.get(id))) {
			return res.code(403).send({
				message: 'player already in game'
			})
		}

		const { roomid, room }  = roomManager.createRoom(gameType);
		room.attachPlayers(playersIds);

		room.expirationTimer = setTimeout(() => {
			console.log('Match Room Expired!');
			closeRoom(room, 1002, "Match room expired");
		}, ROOM_EXPIRATION_TIME)

		playersIds.forEach(id => {
			userSessions.set(id, roomid);
		})
		return { roomId: roomid };
	})
}

export default game;