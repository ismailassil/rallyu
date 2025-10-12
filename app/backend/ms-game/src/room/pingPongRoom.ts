import { getVelocity, angles, updateState } from './physics'
import type { Room, Player, PingPongGameState, TicTacToeGameState, PingPongStatus, GameType, GameMode } from '../types/types'
import ws from 'ws';

const GAME_UPDATE_INTERVAL = 16.67; // 60hz
const GAME_START_DELAY = 3; // 3 sec
const GAME_TIME = 20;

export class PingPongPlayer implements Player {
    id: number;
    roomId: string;
    socket: ws.WebSocket | null = null;
    connected: boolean = false;

    constructor(roomId: string, id: number) {
        this.id = id;
        this.roomId = roomId;
    }

    attachSocket(socket: ws.WebSocket): void {
        this.socket = socket;
        this.connected = true;
    }

    detachSocket(): void {
        this.socket = null;
        this.connected = false;
    }

	setupOnlineEventListeners(room: PingPongRoom): void {
		this.socket!.on('message', (message: ws.RawData) => {
			try {
				const data = JSON.parse(message.toString());
				if (room.state.players[data.pid]) {
					room.state.players[data.pid].y = data.y;
				}
			} catch (e: any) {
				console.log('JSON parse error:', e.message);
			}
		});

		this.socket!.on('close', (ev: ws.CloseEvent) => {
			this.detachSocket();
			console.log('Player disconnected');
			if (ev.code === 1000) return; // normal closure

			const otherPlayer = room.players.find(p => p.id !== this.id);
			if (otherPlayer?.socket && otherPlayer.socket.readyState === ws.OPEN) {
				if (otherPlayer.socket.readyState === ws.OPEN)
					otherPlayer.socket.send(JSON.stringify({ type: 'opp_left' }))
			}
		});
	}

	setupLocalEventListeners(room: PingPongRoom): void {
		this.socket!.on('message', (message: ws.RawData) => {
			try {
				const data = JSON.parse(message.toString());
				room.state.players.forEach((player, index) => player.y = data.pos![index])
			} catch (e: any) {
				console.log('JSON parse error:', e.message);
			}
		});

		this.socket!.on('close', (ev: ws.CloseEvent) => {
			this.detachSocket();
			console.log('Player disconnected');
			if (ev.code === 1000) return; // normal closure
		});
	}

    setupEventListeners(room: PingPongRoom ): void {
		if (room.gameMode === 'online') {
			this.setupOnlineEventListeners(room);
		}
		else {
			this.setupLocalEventListeners(room);
		}
    }
}

export class PingPongRoom implements Room<PingPongGameState, PingPongStatus> {
	id: string;
	gameType: GameType;
	gameMode: GameMode;
	startTime: number | null = null;
	players: Player[] = [];
	running = false;
	timeoutId: NodeJS.Timeout | null = null;
	intervalId: NodeJS.Timeout | null = null;
	expirationTimer: NodeJS.Timeout | null = null;
	gameTimerId: NodeJS.Timeout | null = null;
	state: PingPongGameState;

	constructor(id: string, gameMode: GameMode) {
		this.id = id;
		this.gameType = 'pingpong';
		this.gameMode = gameMode;

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

	attachPlayers(playersIds: number[]): void {
		playersIds.forEach(playerid => this.players.push(new PingPongPlayer(this.id, playerid)));
	}

	
	getStatus(): PingPongStatus {
		return {
			gameType: this.gameType,
			gameMode: this.gameMode,
			ball: this.state.ball,
			players: [
				{
					...(this.gameMode === 'online' ? { ID: this.players[0]!.id } : {}),
					score: this.state.score[0],
					coords: this.state.players[0]
				},
				{
					...(this.gameMode === 'online' ? { ID: this.players[1]!.id } : {}),
					score: this.state.score[1],
					coords: this.state.players[1]
				}
			]
		}
	}

    sendGameOverPacket = () => {
		this.players.forEach(player => {
			if (player.socket?.readyState === ws.OPEN) {
            	player.socket.send(JSON.stringify({
					type: 'gameover',
					scores: this.state.score
				}))
			}
		})
	}

    setupPackets(): NodeJS.Timeout {
        this.players.forEach((player, index) => {
            if (player.socket?.readyState === ws.OPEN)
                player.socket.send(JSON.stringify({ type: 'ready', i: index, t: GAME_START_DELAY }));
		})

		return setTimeout(() => {
			this.players.forEach(player => {
				if (player.socket?.readyState === ws.OPEN)
                    player.socket.send(JSON.stringify({ type: 'start', t: GAME_TIME }))
			})
			this.state.pause = false
		}, GAME_START_DELAY * 1000);
    }

	startGame(): void {
		this.startTime = Math.floor(Date.now() / 1000);
		this.running = true;
		this.timeoutId = this.setupPackets();

		this.players.forEach((p) => {
			p.setupEventListeners(this);
		});

		this.intervalId = setInterval(() => {
			if (!this.state.pause) updateState(this.state);

			this.players.forEach((player, index) => {
				if (player.socket?.readyState === ws.OPEN)
                {
                    player.socket.send(JSON.stringify({
                        type: 'state',
                        state: {
                            b: { x: this.state.ball.x, y: this.state.ball.y },
                            p: this.state.players[index ^ 1].y,
                            s: [this.state.score[0], this.state.score[1]]
                        }
				    }))
                }
			});
		}, GAME_UPDATE_INTERVAL);
	}

	cleanUp(): void {
		clearTimeout(this.timeoutId!);
		clearInterval(this.intervalId!);
		clearTimeout(this.gameTimerId!);
	}
}