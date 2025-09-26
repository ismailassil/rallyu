const { v4: uuidv4 } = require("uuid");
const { updateState, getVelocity, angles } = require('./physics')
const WebSocket = require('ws')

const JWT_ROOM_SECRET = process.env.JWT_ROOM_SECRET || 'R00M_4CC3SS_';
const MS_MATCHMAKING_API_KEY = process.env.MS_MATCHMAKING_API_KEY || 'DEFAULT_MS_MATCHMAKING_SECRET_';

const game = async (fastify, options) => {
	const ROOM_EXPIRATION_TIME = 10000; // 10 sec
    const GAME_START_DELAY = 3000; // 3 sec
    const GAME_UPDATE_INTERVAL = 16.67; // 60fps


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

		setupEventListeners(room, index) {
			this.socket.off('close', this.detachSocket);
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
				if (ev.code === 1000) return;

				const otherPlayer = room.players[index ^ 1].socket
				if (otherPlayer && otherPlayer.readyState === WebSocket.OPEN) { // checks if otherPlayer didn't close too
					fastify.json(otherPlayer, { type: 'opp_left' })
				}
			});
		}
	}

	class Room {
		constructor(id) {
			this.id = id;
			this.players = []
			this.running = false;
			this.timeoutId = null;
			this.intervalId = null;
			this.expirationTimer = null;

			const initialAngle = angles[Math.floor(Math.random() * angles.length)];
			this.state = {
				ball: {
					x: 400,
					y: 300,
					speed: 7,
					angle: initialAngle,
					dir: 'left',
					velocity: getVelocity(initialAngle, 7)
				},
				players: [{ x: 30, y: 300 }, { x: 770, y: 300 }],
				score: [0, 0],
				pause: true
			};
		}

		startGame() {
			this.running = true;
			this.timeoutId = setupPackets(this);

			this.players.forEach((p, index) => {
				p.setupEventListeners(this, index);
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
				room.players.forEach(player => {
					fastify.json(player.socket, {
						type: 'play',
						score: room.state.score
						//timer
					});
				});
			} else if (room.players.every(p => p.connected)) {
				clearTimeout(room.expirationTimer);
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
		return { roomId: session };
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