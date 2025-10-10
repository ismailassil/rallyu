import type { Room, Player, TicTacToeGameState, TicTacToeStatus } from '../types/types'
import ws from 'ws';

const GAME_UPDATE_INTERVAL = 1000; // 1hz
const TOTALROUNDS: number = 3;
const WINNING_COMBOS: number[][] = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
] as const;

export class TicTacToePlayer implements Player {
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

    setupEventListeners(room: TicTacToeRoom): void {
        if (!this.socket) return;

        this.socket.on('message', (message: ws.RawData) => {
            try {
                const data = JSON.parse(message.toString());
                if (room.) {
                    room.state
                }
            } catch (e: any) {
                console.log('JSON parse error:', e.message);
            }
        });

        this.socket.on('close', (ev: ws.CloseEvent) => {
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
}

export class TicTacToeRoom implements Room<TicTacToeGameState, TicTacToeStatus> {
	id: string;
	gameType: string;
	gameMode: string;
	startTime: number | null = null;
	players: Player[] = [];
	running = false;
	timeoutId: NodeJS.Timeout | null = null;
	intervalId: NodeJS.Timeout | null = null;
	expirationTimer: NodeJS.Timeout | null = null;
	gameTimerId: NodeJS.Timeout | null = null;
	state: TicTacToeGameState;

	constructor(id: string, gameMode: string) {
		this.id = id;
		this.gameType = 'tictactoe';
		this.gameMode = gameMode;

		this.state = {
			cells: [['', '', ''], ['', '', ''], ['', '', '']],
			currentRound: 1,
			roundTimer: 0,
			score: [0, 0]
		};
	}

	attachPlayers(playersIds: number[]): void {
		playersIds.forEach(playerid => this.players.push(new TicTacToePlayer(this.id, playerid)));
	}

	getStatus(): TicTacToeStatus {
		return {
			cells: this.state.cells,
			currentRound: this.state.currentRound,
			players: [
				{
					...(this.gameMode === 'online' ? { ID: this.players[0]!.id } : {}),
					score: this.state.score[0],
				},
				{
					...(this.gameMode === 'online' ? { ID: this.players[0]!.id } : {}),
					score: this.state.score[0],
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

    setupPackets(): void {
        this.players.forEach((player, index) => {
            if (player.socket?.readyState === ws.OPEN)
                player.socket.send(JSON.stringify({ type: 'ready', i: index }));
		})
    }

	startGame(): void {
		this.startTime = Math.floor(Date.now() / 1000);
		this.running = true;

		this.setupPackets();

		this.players.forEach((p) => {
			p.setupEventListeners(this);
		});

		this.intervalId = setInterval(() => {

			this.players.forEach((player, index) => {
				if (player.socket?.readyState === ws.OPEN)
                {
                    player.socket.send(JSON.stringify({
                        type: 'state',
                        state: {
							c: this.state.cells,
                            s: this.state.score,
							r: this.state.currentRound,
							t: this.state.roundTimer
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