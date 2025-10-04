const { v4: uuidv4 } = require("uuid");
const { updateState, getVelocity, angles } = require('./physics')
const WebSocket = require('ws');

const MS_MATCHMAKING_API_KEY = process.env.MS_MATCHMAKING_API_KEY || 'DEFAULT_MS_MATCHMAKING_SECRET_';

const game = async (fastify, options) => {
	const ROOM_EXPIRATION_TIME = 10000; // 10 sec
    const GAME_START_DELAY = 3000; // 3 sec
    const GAME_UPDATE_INTERVAL = 16.67; // 60hz
    const GAME_TIME = 93000; // 90 seconds


	fastify.decorate('json', (socket, obj) => {
		if (socket?.readyState === WebSocket.OPEN)
			socket.send(JSON.stringify(obj))
	})

	const rooms = new Map() // Map<roomid, Room>
	const userSessions = new Map() // Map<userid, roomid>

	const closeRoom = (room, code, msg) => {
		// test this if players already closed sockets
		room.players.forEach(p => {
			userSessions.delete(p.id);
			if (p.socket?.readyState === WebSocket.OPEN)
				p.socket.close(code, msg);
		})
		room.cleanUp();
		rooms.delete(room.id)
	}

	const getResults = (scores) => {
		const [p1, p2] = scores;
	  
		if (p1 > p2) return ["win", "loss"];
		if (p1 < p2) return ["loss", "win"];
		return ["tie", "tie"];
	}
	
	const sendGameOverPacket = (room) => {
		const scores = [room.players[0].score, room.players[1].score];
		const results = getResults(scores);

		room.players.forEach((p, i) => {
			fastify.json(p.socket,  {
				type: 'gameover',
				result: results[i]
			})
		})
	}

	const setupPackets = (room) => {
		room.players.forEach((player, index) => {
			fastify.json(player.socket, { type: 'ready', i: index })
		})

		return setTimeout(() => {
			room.players.forEach(player => {
				fastify.json(player.socket, { type: 'start' })
			})
			room.state.pause = false
		}, GAME_START_DELAY);
	}

	class Player {
		constructor(roomId, id) {
			this.id = id;
			this.roomId = roomId;
			this.socket = null;
			this.connected = false;
		}

		attachSocket(socket) {
			this.socket = socket;
			this.connected = true;
		}

		detachSocket() {
			this.socket = null;
			this.connected = false;
		}

		setupEventListeners(room) {
			this.socket.on("message", (message) => {
				try {
					const data = JSON.parse(message.toString())
					room.state.players[data.pid].y = data.y
				} 
				catch (e) {
					console.log(`JSON parse error: `, e.message)
				}
			});

			this.socket.on("close", (ev) => {
				this.detachSocket();
				console.log('Player disconncted');
				if (ev.code === 1000) return;

				const otherPlayer = room.players.find(p => p.id !== this.id);
				if (otherPlayer && otherPlayer.socket && otherPlayer.socket.readyState === WebSocket.OPEN) { // checks if otherPlayer didn't close too
					fastify.json(otherPlayer.socket, { type: 'opp_left' })
				}
			});
		}
	}

	class Room {
		constructor(id) {
			this.startTime = null;
			this.id = id;
			this.players = []
			this.running = false;
			this.timeoutId = null;
			this.intervalId = null;
			this.expirationTimer = null;
			this.gameTimerId = null;

			const initialAngle = angles[Math.floor(Math.random() * angles.length)];
			this.state = {
				ball: {
					x: 800,
					y: 600,
					speed: 14,
					angle: initialAngle,
					dir: 'left',
					velocity: getVelocity(initialAngle, 14)
				},
				players: [{ x: 20, y: 600 }, { x: 1580, y: 600 }],
				score: [0, 0],
				pause: true
			};
		}

		startGame() {
			this.startTime = Date.now();
			this.running = true;
			this.timeoutId = setupPackets(this);

			this.players.forEach((p) => {
				p.setupEventListeners(this);
			});

			this.intervalId = setInterval(()=> {
				if (!this.state.pause) updateState(this.state)

				this.players.forEach((player, index) => {
					fastify.json(player.socket, {
						type: 'state',
						state: {
							b: { x: this.state.ball.x, y: this.state.ball.y },
							p: this.state.players[index ^ 1].y,
							s: [ this.state.score[0], this.state.score[1] ]
						}
					})
				})
			}, GAME_UPDATE_INTERVAL);
		}

		cleanUp() {
			clearTimeout(this.timeoutId);
			clearInterval(this.intervalId);
			clearTimeout(this.gameTimerId);
		}
	}

	fastify.get('/room/:roomid' , { websocket: true }, (socket, req) => {
		try {
			const { roomid } = req.params;
			const user = Number(req.query.user);
			const sessionId = userSessions.get(user);

			if (sessionId != roomid) 
				throw new Error("Session and room ID mismatch");

			const room = rooms.get(roomid);
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
				fastify.json(room.players[index ^ 1].socket, {
					type: 'opp_joined'
				})
				fastify.json(player.socket, {
					type: 'reconnected',
					score: room.state.score,
					i: index,
					time: Math.round((GAME_TIME - (Date.now() - room.startTime)) / 1000)
				});
			} else if (room.players.every(p => p.connected)) {
				clearTimeout(room.expirationTimer);
				room.gameTimerId = setTimeout(() => {
					sendGameOverPacket(room);
					// send Game data to ezzuz
					closeRoom(room, 1003, 'Game Over');
				}, GAME_TIME);
				room.startGame();
			}

			socket.on('close', player.detachSocket);
		} catch (e) {
			console.error("Match room error: ", e);
			
			return socket.close(1001, `Access denied: ${e.message}`);
		}
	})

	fastify.get('/user/:userid', (req, res) => {
		const user = Number(req.params.userid);
		const session = userSessions.get(user);
		if (!session){
			return res.code(404).send({
				message: 'user not currently on an active game.'
			})
		}
		const opponentId = rooms.get(session)?.players?.find(player => player.id !== user)?.id;
	
		return {
			roomId: session,
			opponentId
		};
	})

	fastify.post('/create-room', (req, res) => {
		const auth = req.headers.authorization.startsWith('Bearer ')
            ? req.headers.authorization.slice(7)
            : req.headers.authorization;

		if (auth !== MS_MATCHMAKING_API_KEY)
			return res.code(401);

		const { playersIds } = req.body;
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

		const roomId = uuidv4();
		const room = new Room(roomId);
		room.players = [new Player(roomId, playersIds[0]), new Player(roomId, playersIds[1])];

		room.expirationTimer = setTimeout(() => {
			closeRoom(room, 1002, "Match room timeout reached");
		}, ROOM_EXPIRATION_TIME)

		rooms.set(roomId, room);
		playersIds.forEach(id => {
			userSessions.set(id, roomId);
		})
		console.log('1st sessions: ', userSessions);
		return { roomId };
	})
}

module.exports = {
	game,
}