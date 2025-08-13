/*
	Keys :
		t => type Values :	w => waiting
												s => start
												o => gameover
		r => result Values :	w => winner
													l => loser
*/
const { v4: uuidv4 } = require("uuid");
const { updateState, getVelocity, angles } = require('./physics')
const WebSocket = require('ws')


/*
	Packet: Obj: any

	Player {
		playerId: string,
		socket: WebSocket,
		connected: true
	}

	Room {
		players: [Player, Player],
		state: GameState
	}

*/

const game = async (fastify, options) => {
	const ROOM_EXPIRATION_TIME = 10000; // 10 sec
    const GAME_START_DELAY = 3000; // 3 sec
    const GAME_UPDATE_INTERVAL = 16.67; // 60fps


	fastify.decorate('json', (socket, obj) => {
		if (player.socket?.readyState === WebSocket.OPEN)
			socket.send(JSON.stringify(obj))
	})

	const rooms = new Map() // Map<roomid, Room>

	const closeRoom = (room) => {
		// test this if players already closed sockets
		room.players.forEach(p => {
			if (p.socket?.readyState === WebSocket.OPEN)
				p.socket.close(1000);
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
			this.socket.on("message", () => {
				try {
					const data = JSON.parse(message.toString())
					room.state.players[data.pid].y = data.y
				} 
				catch (e) {
					console.log(`JSON parse error: `, e.message)
				}
			});

			this.socket.on("close", () => {
				this.detachSocket();
				if (ev.code === 1000) return;

				const otherPlayer = room.players[index ^ 1].socket
				if (otherPlayer.readyState === WebSocket.OPEN) { // checks if otherPlayer didn't close too
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
				if (!room.state.pause) updateState(room.state)
	
				room.players.forEach((player, index) => {
					fastify.json(player.socket, {
						type: 'state',
						state: {
							b: { x: room.state.ball.x, y: room.state.ball.y },
							p: room.state.players[index ^ 1].y,
							s: [ room.state.score[0], room.state.score[1] ]
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

	fastify.get('/:roomid' , { websocket: true }, (socket, req) => {
		try {
			const { token } = req.query;
			const decoded = fastify.jwt.verify(token);
			if (decoded.roomId !== req.params.roomid)
				throw new Error("Room ID mismatch")

			const room = rooms.get(decoded.roomId);
			if (!room)
				throw new Error("Room not found");

			const player = room.players.find(player => player.id === decoded.playerId)
			if (!player)
				throw new Error("Player not in room");
			if (player.connected)
				throw new Error("A connection already exits");

			player.attachSocket(socket);
			if (room.running) {
				room.players.forEach(player => {
					fastify.json(player.socket, { type: 'start' });
				});
			} else if (room.players.every(p => p.connected)) {
				clearTimeout(room.expirationTimer);
				room.startGame();
			}

			socket.on('close', () => {
				player.detachSocket();
			})
		} catch (e) {
			return socket.close(1001, `Access denied: ${e.message}`);
		}
	})

	fastify.post('/create-room', (req, res) => {
		const { playersIds } = req.body;
		const roomId = uuidv4();
		const room = new Room(roomId);
		room.players = [new Player(roomId, playersIds[0]), new Player(roomId, playersIds[1])];

		room.expirationTimer = setTimeout(() => {
			closeRoom(room);
		}, ROOM_EXPIRATION_TIME)

		rooms.set(roomId, room);

		return {
			roomId,
			authTokens: {
				[playersIds[0]]: fastify.jwt.sign({
					roomId,
					playerId: playersIds[0]
				}),
				[playersIds[1]]: fastify.jwt.sign({
					roomId,
					playerId: playersIds[1]
				})
			}
		};
	})
}

module.exports = {
	game,
}