import { getVelocity, angles, updateState } from './pongPhysics'
import type { Room, Player, PingPongGameState, PingPongStatus, GameType } from '../types/types'
import ws from 'ws';
import { closeRoom } from './roomManager';
import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config

// AUTH
const MS_AUTH_PORT = process.env.MS_AUTH_PORT;
const MS_AUTH_HOST = process.env.MS_AUTH_HOST;
const MS_AUTH_API_KEY = process.env.MS_AUTH_API_KEY;

// TOURNAMENT
const MS_TOURN_PORT = process.env.MS_TOURN_PORT;
const MS_TOURN_HOST = process.env.MS_TOURN_HOST;
const MS_TOURN_API_KEY = process.env.MS_TOURN_API_KEY;

const GAME_UPDATE_INTERVAL = 16.67; // 60hz
const GAME_START_DELAY = 3000; // 3 sec
const GAME_TIME = 60000;

export class PingPongPlayer implements Player {
    id: number;
    index: number;
    roomId: string;
    socket: ws.WebSocket | null = null;
    connected: boolean = false;
	status: string = 'countdown'; // ingame

    constructor(roomId: string, id: number, index: number) {
        this.id = id;
        this.roomId = roomId;
		this.index = index
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
				}
			} catch (e: any) {
				console.log('JSON parse error:', e.message);
			}
		});

		this.socket!.on('close', (ev: ws.CloseEvent) => {
			const closedSocket = this.socket // reference to the original socket

			if (closedSocket !== this.socket)
				return;

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
	tournament?: { gameId: number, id: number } | undefined;
	startTime: number = 0;
	players: PingPongPlayer[] = [];
	running = false;
	timeoutId: NodeJS.Timeout | undefined = undefined;
	intervalId: NodeJS.Timeout | undefined = undefined;
	expirationTimer: NodeJS.Timeout | undefined = undefined;
	gameTimerId: NodeJS.Timeout | undefined = undefined;
	state: PingPongGameState;

	constructor(id: string, tournament: { gameId: number, id: number } | undefined) {
		this.id = id;
		this.gameType = 'pingpong';

		if (tournament) this.tournament = tournament;

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
					speed: 12
				},
				{
					coords: { x: 1580, y: 450 },
					movement: 'still',
					speed: 12
				}
			],
			score: [0, 0],
			pause: true,
		};
	}

	attachPlayers(playersIds: number[]): void {
		playersIds.forEach((playerid, index) => this.players.push(new PingPongPlayer(this.id, playerid, index)));
	}

	
	getStatus(): PingPongStatus {
		return {
			gameType: this.gameType,
			ball: this.state.ball,
			players: [
				{
					ID: this.players[0]!.id,
					score: this.state.score[0],
					coords: this.state.players[0].coords,
					connected: this.players[0].connected
				},
				{
					ID: this.players[1]!.id,
					score: this.state.score[1],
					coords: this.state.players[1].coords,
					connected: this.players[1].connected
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
					score: this.state.score,
					tournamentId: this.tournament?.id
				}))
			}
		})
		closeRoom(this, 1000, 'Game Over');
		this.saveGameData();
	}

	sendForfeitPacket = (yeilder: number) => {
		if (this.state.score[yeilder ^ 1] <= this.state.score[yeilder])
			this.state.score[yeilder ^ 1] += this.state.score[yeilder] - this.state.score[yeilder ^ 1] + 4

		this.players.forEach((player, i) => {
			if (player.socket?.readyState === ws.OPEN) {
            	player.socket.send(JSON.stringify({
					type: 'gameover',
					result: yeilder === i ? 'loss' : 'win',
					score: this.state.score,
					tournamentId: this.tournament?.id
				}))
			}
		})
		closeRoom(this, 1000, 'Forfeit');
		this.saveGameData();
	}

    private setupPackets() {
        this.players.forEach((player, index) => {
            if (player.socket?.readyState === ws.OPEN)
                player.socket.send(JSON.stringify({ type: 'ready', i: index, t: GAME_START_DELAY }));
		})

    }

	reconnect(player: PingPongPlayer): void {
		player.setupEventListeners(this);
		const opponent = this.players.find(p => p !== player);
		if (opponent && opponent.socket?.readyState === WebSocket.OPEN)
			opponent.socket.send(JSON.stringify({type: 'opp_joined'}))
		
		let time;
		if (this.startTime === 0)
			time = 0;
		else
			time = (GAME_TIME + GAME_START_DELAY) - (Date.now() - this.startTime)


		if (player.socket?.readyState === WebSocket.OPEN) {
			player.socket!.send(JSON.stringify({
				type: 'reconnected',
				score: this.state.score,
				i: this.players.indexOf(player),
				t: time
			}));
		}
	}

	private gameloop() {
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

	startGame(): void {
		this.running = true;
		this.startTime = Date.now();
		
		this.players.forEach((p) => {
			p.setupEventListeners(this);
		});
		
		this.setupPackets();
		this.gameTimerId = setTimeout(async () => {
			this.handleGameOver();
			
		}, GAME_TIME);

		this.timeoutId = setTimeout(() => {
			this.players.forEach(player => {
				if (player.socket?.readyState === ws.OPEN)
                    player.socket.send(JSON.stringify({ type: 'start', t: GAME_TIME }))
			})
			this.state.pause = false
			this.gameloop();
		}, GAME_START_DELAY);
	}

	cleanUp(): void {
		clearTimeout(this.timeoutId!);
		clearInterval(this.intervalId!);
		clearTimeout(this.gameTimerId!);
	}

	private async saveGameData() {
		try {
			await axios.post(`http://${MS_AUTH_HOST}:${MS_AUTH_PORT}/users/matches`, {
				player1: {
					ID: this.players[0].id, 
					score: this.state.score[0]
				},
				player2: {
					ID: this.players[1].id, 
					score: this.state.score[1]
				},
				gameStartedAt: Math.floor(this.startTime / 1000),
				gameFinishedAt: Math.floor(Date.now() / 1000),
				gameType:  'PONG',
			}, {
				headers: {
					'Authorization': `Bearer ${MS_AUTH_API_KEY}`
			}});

			if (!this.tournament) return;
			
			await axios.patch(`http://${MS_TOURN_HOST}:${MS_TOURN_PORT}/api/v1/tournament/match/progress`, {
				player1: {
					ID: this.players[0].id, 
					score: this.state.score[0]
				},
				player2: {
					ID: this.players[1].id, 
					score: this.state.score[1]
				},
				gameStartedAt: Math.floor(this.startTime / 1000),
				gameFinishedAt: Math.floor(Date.now() / 1000),
				gameType:  'PONG',
				gameId: this.tournament?.gameId
			}, {
				headers: {
					'Authorization': `Bearer ${MS_TOURN_API_KEY}`
			}});
		} catch (err) {
			console.log("error from user management: ", err);
		}
	}
}