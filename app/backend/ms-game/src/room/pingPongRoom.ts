import { getVelocity, angles, updateState } from './physics'
import type { Room, Player, PingPongGameState, TicTacToeGameState, PingPongStatus, GameType } from '../types/types'
import ws from 'ws';
import { closeRoom, userSessions } from './roomManager';

const GAME_UPDATE_INTERVAL = 16.67; // 60hz
const GAME_START_DELAY = 3000; // 3 sec
const GAME_TIME = 20000;

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

    setupEventListeners(room: PingPongRoom ): void {
		this.socket!.on('message', (message: ws.RawData) => {
			try {
				const data = JSON.parse(message.toString());
				switch (data.type) {
					case 'move':
						room.state.players[data.pid].movement = data.dir;
						break;
					case 'forfeit':
						room.sendForfeitPacket(data.pid);
						closeRoom(room, 1003, 'Game Over');
						room.saveGameData();
				}
			} catch (e: any) {
				console.log('JSON parse error:', e.message);
			}
		});

		this.socket!.on('close', (ev: ws.CloseEvent) => {
			this.detachSocket();
			console.log(`Player ${this.id} disconnected`);
			if (ev.code === 1000) return; // normal closure

			const otherPlayer = room.players.find(p => p.id !== this.id);
			if (otherPlayer?.socket && otherPlayer.socket.readyState === ws.OPEN) {
				if (otherPlayer.socket.readyState === ws.OPEN){
					otherPlayer.socket.send(JSON.stringify({ type: 'opp_left' }))
					console.log('Opp_left packet sent to user : ', otherPlayer.id);
				}
			}
		});
    }
}

export class PingPongRoom implements Room<PingPongGameState, PingPongStatus> {
	id: string;
	gameType: GameType;
	startTime: number | null = null;
	players: PingPongPlayer[] = [];
	running = false;
	timeoutId: NodeJS.Timeout | undefined = undefined;
	intervalId: NodeJS.Timeout | undefined = undefined;
	expirationTimer: NodeJS.Timeout | undefined = undefined;
	gameTimerId: NodeJS.Timeout | undefined = undefined;
	state: PingPongGameState;

	constructor(id: string, ) {
		this.id = id;
		this.gameType = 'pingpong';

		const initialAngle = angles[Math.floor(Math.random() * angles.length)];
		this.state = {
			ball: {
				x: 800,
				y: 450,
				speed: 14,
				angle: initialAngle,
				dir: 'left',
				velocity: getVelocity(initialAngle, 14)
			},
			players: [
				{
					coords: { x: 20, y: 450 },
					movement: 'still',
					speed: 15
				},
				{
					coords: { x: 1580, y: 450 },
					movement: 'still',
					speed: 15
				}
			],
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
			ball: this.state.ball,
			players: [
				{
					ID: this.players[0]!.id,
					score: this.state.score[0],
					coords: this.state.players[0].coords
				},
				{
					ID: this.players[1]!.id,
					score: this.state.score[1],
					coords: this.state.players[1].coords
				}
			]
		}
	}

	private getResults = () => {
		const [p1, p2] = this.state.score;
	  
		if (p1 > p2) return ["win", "loss"];
		if (p1 < p2) return ["loss", "win"];
		return ["tie", "tie"];
	}

    private handleGameOver = () => {
		const results = this.getResults();
	
		this.players.forEach((player, i) => {
			if (player.socket?.readyState === ws.OPEN) {
            	player.socket.send(JSON.stringify({
					type: 'gameover',
					result: results[i],
					score: this.state.score
				}))
			}
		})
	}

	sendForfeitPacket = (yeilder: number) => {
		console.log("forfeit: ", yeilder)
		this.state.score = yeilder === 0 ? [0, 3] : [3, 0];

		this.players.forEach((player, i) => {
			if (player.socket?.readyState === ws.OPEN) {
            	player.socket.send(JSON.stringify({
					type: 'gameover',
					result: yeilder === i ? 'loss' : 'win',
					score: this.state.score
				}))
			}
		})
	}

    private setupPackets(): NodeJS.Timeout {
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
		}, GAME_START_DELAY);
    }

	saveGameData() {
		try {
			// await axios.post(`http://ms-auth:${5005}/users/matches`, {
			// 	players: [
			// 		{ 
			// 			ID: this.players[0].id, 
			// 			score: this.state.score[0]
			// 		},
			// 		{
			// 			ID: this.players[1].id, 
			// 			score: this.state.score[1]
			// 		}
			// 	],
			// 	gameStartedAt: this.startTime,
			// 	gameFinishedAt: Math.floor(Date.now() / 1000)
			// });
		} catch (err) {
			console.log("error from user management: ", err);
		}
	}

	reconnect(player: PingPongPlayer): void {
		player.setupEventListeners(this);
		const opponent = this.players.find(p => p !== player);
		if (opponent && opponent.socket?.readyState === WebSocket.OPEN)
			opponent.socket.send(JSON.stringify({type: 'opp_joined'}))

		if (player.socket?.readyState === WebSocket.OPEN) {
			player.socket!.send(JSON.stringify({
				type: 'reconnected',
				score: this.state.score,
				i: this.players.indexOf(player),
				t: Math.round(GAME_TIME - (Date.now() - this.startTime!))
			}));
		}
	}

	startGame(): void {
		this.running = true;
		this.timeoutId = this.setupPackets();
		
		this.players.forEach((p) => {
			p.setupEventListeners(this);
		});

		this.startTime = Math.floor(Date.now() / 1000);
		this.gameTimerId = setTimeout(async () => {
			this.handleGameOver();
			closeRoom(this, 1003, 'Game Over');
			this.saveGameData();
		}, GAME_TIME);

		this.intervalId = setInterval(() => {
			updateState(this.state);

			this.players.forEach((player, index) => {
				if (player.socket?.readyState === ws.OPEN)
                {
                    player.socket.send(JSON.stringify({
                        type: 'state',
                        state: {
                            b: { x: this.state.ball.x, y: this.state.ball.y },
                            opp: this.state.players[index ^ 1].coords.y,
                            p: this.state.players[index].coords.y,
                            s: this.state.score
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