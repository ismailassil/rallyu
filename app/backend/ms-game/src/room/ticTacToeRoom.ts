import type { Room, Player, TicTacToeGameState, TicTacToeStatus, GameType, Coords, XOSign } from '../types/types'
import ws from 'ws';
import { closeRoom } from './roomManager';

const TOTAL_ROUNDS: number = 3;
const MOVE_TIMEOUT: number = 15000;
const COUNTDOWN_TIME: number = 3000;
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

export class TicTacToePlayer implements Player<TicTacToeRoom> {
    id: number;
    roomId: string;
    socket: ws.WebSocket | null = null;
    connected: boolean = false;
	score: number = 0;

    constructor(roomId: string, id: number, public sign: XOSign) {
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
		console.log('Setup Event Listeners p.socket: ', this.socket);
        if (!this.socket) return;

        this.socket.on('message', (message: ws.RawData) => {
            try {
                const data = JSON.parse(message.toString());
				console.log("received message: ", data);
				switch (data.type) {
					case 'move':
						if (room.state.currentPlayer !== this.sign || !room.playMove(data.move, this.sign)) {
							return;
						}
						break;
					case 'forfeit':
						room.handleForfeit(this);
						break;
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
	gameType: GameType;
	startTime: number | null = null;
	players: TicTacToePlayer[] = [];
	running = false;
	timeoutId: NodeJS.Timeout | undefined | undefined;
	expirationTimer: NodeJS.Timeout | undefined = undefined;
	gameTimerId: NodeJS.Timeout | undefined = undefined;
	state: TicTacToeGameState;

	constructor(id: string, ) {
		this.id = id;
		this.gameType = 'tictactoe';

		this.state = {
			cells: ['', '', '', '', '', '', '', '', ''],
			currentRound: 1,
			currentPlayer: Math.random() > 0.5 ? 'X' : 'O'
		};
	}

	public attachPlayers(playersIds: number[]): void {
		playersIds.forEach((playerid, i) => this.players.push(new TicTacToePlayer(this.id, playerid, i % 2 === 0 ? 'X' : 'O')));
	}

	public getStatus(): TicTacToeStatus {
		return {
			gameType: 'tictactoe',
			cells: this.state.cells,
			currentRound: this.state.currentRound,
			currentPlayer: this.state.currentPlayer,
			players: [
				{
					ID: this.players[0]!.id,
					score: this.players[0].score,
				},
				{
					ID: this.players[0]!.id,
					score: this.players[0].score,
				}
			]
		}
	}

	private setupPackets(): void {
        this.players.forEach(player => {
            if (player.socket?.readyState === ws.OPEN)
                player.socket.send(JSON.stringify({ type: 'ready', sign: player.sign }));
		})
    }

	public handleForfeit(forfeitingPlayer: Player): void {
		const winner = this.players.find(p => p !== forfeitingPlayer);
		const forfeiter = forfeitingPlayer;
	
		if (!winner) return;
	
		winner.score = TOTAL_ROUNDS;
		forfeiter.score = 0;
	
		this.broadcastToPlayers({
			type: 'gameover',
			forfeitingPlayer: forfeiter.sign,
			winner: winner.sign,
			score: this.players.map(p => p.score),
		});
	
		setTimeout(() => {
			closeRoom(this, 1004, 'Forfeit');
		}, 3000);
	}

	playMove(move: number, sign: XOSign): boolean {
		if (move < 0 || move > 9 || this.state.cells[move] !== '')
			return false;

		this.state.cells[move] = sign;
		this.state.currentPlayer = this.state.currentPlayer === 'X' ? 'O' : 'X';
		this.broadcastToPlayers({
			type: 'move',
			move: move,
			sign: sign,
			duration: MOVE_TIMEOUT,
			currentPlayer: this.state.currentPlayer
		});

		const winner = this.checkWin();
		if (winner) {
			this.handleWin(winner);
		} else if (this.checkDraw()) {
			this.handleDraw();
		} else {
			this.resetTurnTimer();
		}
		
		return true;
	}
	
	private checkWin(): XOSign | null {
		for (const [a, b, c] of WINNING_COMBOS) {
			if (
				this.state.cells[a] !== '' &&
				this.state.cells[a] === this.state.cells[b] &&
				this.state.cells[a] === this.state.cells[c]
			) {
				return this.state.cells[a];
			}
		}
		return null;
	}
	
	private checkDraw(): boolean {
		return this.state.cells.every(cell => cell !== '');
	}
	
	private handleWin(winner: XOSign): void {
		const winnerPlayer = this.players.find(p => p.sign === winner);
		if (winnerPlayer) {
			winnerPlayer.score++;
		}

		this.broadcastToPlayers({
			type: 'round_result',
			winner: winner,
			score: this.players.map(p => p.score),
			currentRound: this.state.currentRound
		});

		this.state.currentRound++;
		
		if (this.state.currentRound > TOTAL_ROUNDS) {
			this.handleGameOver();
		} else {
			this.startRound();
		}
	}
	
	private handleDraw(): void {
		this.broadcastToPlayers({
			type: 'round_result',
			winner: 'draw',
			score: this.players.map(p => p.score),
			currentRound: this.state.currentRound
		});
	
		this.state.currentRound++;
		
		if (this.state.currentRound > TOTAL_ROUNDS) {
			this.handleGameOver();
		} else {
			this.startRound();
		}
	}
	
	
	private handleGameOver(): void {
		const overallWinner = this.determineOverallWinner();
		
		this.broadcastToPlayers({
			type: 'gameover',
			winner: overallWinner,
			score: this.players.map(p => p.score)
		});

		closeRoom(this, 1003, 'GameOver');
	}
	
	private startRound(): void {
		this.broadcastToPlayers({
			type: 'countdown',
			duration: COUNTDOWN_TIME, // 3 seconds
			round: this.state.currentRound
		});
	
		clearTimeout(this.timeoutId)
		this.timeoutId = setTimeout(() => {
			this.resetBoard();
			this.broadcastToPlayers({
				type: 'round_start',
				round: this.state.currentRound,
				duration: MOVE_TIMEOUT,
				currentPlayer: this.state.currentPlayer
			});
			this.resetTurnTimer();
		}, COUNTDOWN_TIME);
	}
	
	private resetBoard(): void {
		this.state.cells = Array(9).fill('');
		this.state.currentPlayer = 'X'; // Or alternate who starts
	}
	
	private resetTurnTimer(): void {
		clearTimeout(this.gameTimerId);
		this.gameTimerId = setTimeout(() => {
			this.handleTurnTimeout();
		}, MOVE_TIMEOUT);
	}
	
	private handleTurnTimeout(): void {
		const winnerSign = this.state.currentPlayer === 'X' ? 'O' : 'X';
		this.handleWin(winnerSign);
	}
	
	private determineOverallWinner(): XOSign | 'draw' {
		const [player1, player2] = this.players;
		if (player1.score > player2.score) return player1.sign;
		if (player2.score > player1.score) return player2.sign;
		return 'draw';
	}
	
	public broadcastToPlayers(message: any): void {
		this.players.forEach(player => {
			if (player.socket?.readyState === WebSocket.OPEN) {
				player.socket.send(JSON.stringify(message));
			}
		});
	}

	reconnect(player: TicTacToePlayer): void {
		player.setupEventListeners(this);
		const opponent = this.players.find(p => p !== player);
		if (opponent && opponent.socket?.readyState === WebSocket.OPEN)
			opponent.socket.send(JSON.stringify({type: 'opp_joined'}))

		if (player.socket?.readyState === WebSocket.OPEN) {
			player.socket!.send(JSON.stringify({
				type: 'reconnected',
				cells: this.state.cells,
				score: [this.players[0].score, this.players[1].score],
				sign: player.sign,
				currentPlayer: this.state.currentPlayer,
				currentRound: this.state.currentRound,
				// countdown or round time
			}));
		}
	}

	startGame(): void {
		this.startTime = Math.floor(Date.now() / 1000);
		this.running = true;
		this.state.currentRound = 1;

		this.players.forEach((p) => {
			p.setupEventListeners(this);
		});

		this.setupPackets();

		this.startRound();
	}

	cleanUp(): void {
		clearTimeout(this.gameTimerId);
		clearTimeout(this.timeoutId);
		clearInterval(this.expirationTimer);
	}
}