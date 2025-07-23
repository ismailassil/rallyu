import { randomUUID } from 'crypto';
import {
	cbType,
	gameType,
	symbolType,
	plType,
	tcbType,
	GameResult,
	GameState,
} from '../shared/types/game.types';
import fastify from '../app';

class GameService {
	private static readonly WINNING_COMBOS: number[][] = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	] as const;

	private static readonly EMPTY_CELL = '';
	private static readonly BOARD_SIZE = 9;
	private static readonly DEFAULT_GAME_TIME = 6;

	private readonly gameId: string = randomUUID();
	private cells!: string[];
	private startingPlayer: plType;
	private currentPlayer: plType;
	private readonly type: gameType = 'local';
	private timerInterval!: NodeJS.Timeout | undefined;
	private totalRounds: number = 3;
	private currentRound: number = 1;
	private currentSymbol: symbolType = 'cross';
	private score = { pl1: 0, pl2: 0 };

	constructor(
		gameId: string,
		type = 'local' as gameType,
		rounds = GameService.DEFAULT_GAME_TIME,
	) {
		this.currentPlayer = this.getRandomStartingPlayer();
		this.gameId = gameId;
		this.type = type;
		this.startingPlayer = this.currentPlayer;
		this.totalRounds = rounds;
		this.currentRound = 1;
		this.score = { pl1: 0, pl2: 0 };
		this.currentSymbol = 'cross';

		this.resetBoard();
	}

	get _currentPlayer(): string {
		return this.currentPlayer;
	}
	get _totalRounds(): number {
		return this.totalRounds;
	}

	public play(index: number): GameResult {
		this.clearTimer();
		if (this.isGameOver()) {
			return this.createGameOverResult();
		}

		if (!this.isValidMove(index)) {
			return { status: 'invalid_move' };
		}

		this.makeMove(index);

		const roundResult = this.checkRoundEnd();

		if (roundResult) {
			return this.handleRoundEnd(roundResult);
		}

		this.switchTurn();
		return this.createOngoingResult();
	}

	public getState(): GameState {
		return {
			gameId: this.gameId,
			cells: [...this.cells],
			currentPlayer: this.currentPlayer,
			currentRound: this.currentRound,
			totalRounds: this.totalRounds,
			score: { ...this.score },
		};
	}

	private createOngoingResult(): GameResult {
		return {
			status: 'going',
			cells: [...this.cells],
			currentPlayer: this.currentPlayer,
		};
	}

	private createGameOverResult(): GameResult {
		this.currentRound--;

		return {
			status: 'gameOver',
			winner: this.gameWinner(),
			states: { ...this.getState(), currentRound: this.currentRound },
		};
	}

	public nextRound() {
		this.resetBoard();

		return {
			cells: [...this.cells],
			timeLeft: GameService.DEFAULT_GAME_TIME,
			currentRound: this.currentRound,
			currentPlayer: this.currentPlayer,
		};
	}

	private checkWinner(symbol: symbolType): boolean {
		for (const combo of GameService.WINNING_COMBOS) {
			const isWinning = combo.every((cell) => this.cells[cell] === symbol);
			if (isWinning) return true;
		}

		return false;
	}

	private switchStartingPlayer(): void {
		this.startingPlayer = this.startingPlayer === 'pl1' ? 'pl2' : 'pl1';
		this.currentPlayer = this.startingPlayer;
	}

	public resetRound(): void {
		this.clearTimer();
		this.currentRound++;
		this.resetBoard();
		this.switchStartingPlayer();
		this.currentSymbol = 'cross';
	}

	private handleRoundEnd(result: 'win' | 'draw'): GameResult {
		const copyCells = [...this.cells];

		if (result === 'win') {
			this.score[this.currentPlayer]++;
		}

		this.resetRound();

		const gameState = this.getState();

		if (this.isGameOver()) {
			this.currentRound--;
			return {
				status: 'gameOver',
				winner: this.gameWinner(),
				cells: copyCells,
				currentPlayer: this.currentPlayer,
				states: { ...gameState, currentRound: this.currentRound },
			};
		}

		return {
			status: result,
			winner: result === 'win' ? this.currentPlayer : undefined,
			cells: copyCells,
			states: gameState,
		};
	}

	private checkRoundEnd() {
		if (this.checkWinner(this.currentSymbol)) {
			return 'win';
		}

		if (this.isBoardFull()) return 'draw';
	}

	// ** Private helper methods
	private isBoardFull(): boolean {
		if (this.cells.every((cell) => cell !== GameService.EMPTY_CELL)) return true;
		return false;
	}

	private switchTurn(): void {
		this.clearTimer();
		this.currentSymbol = this.currentSymbol === 'cross' ? 'circle' : 'cross';
		this.currentPlayer = this.currentPlayer === 'pl1' ? 'pl2' : 'pl1';
	}

	private isGameOver(): boolean {
		this.clearTimer();
		return this.currentRound === this.totalRounds + 1;
	}

	private makeMove(index: number): void {
		this.clearTimer();
		this.cells[index] = this.currentSymbol;
	}

	private isValidMove(index: number) {
		if (index >= 0 && index < 9 && this.cells[index] === GameService.EMPTY_CELL)
			return true;
		return false;
	}

	private gameWinner() {
		const { pl1, pl2 } = this.score;

		if (pl1 === pl2) return 'draw';
		return pl1 > pl2 ? 'pl1' : 'pl2';
	}

	private resetBoard(): void {
		this.cells = new Array(GameService.BOARD_SIZE).fill(GameService.EMPTY_CELL);
	}

	private getRandomStartingPlayer(): plType {
		return Math.random() > 0.5 ? 'pl1' : 'pl2';
	}

	// ** Timer methods
	public onTick(callback: cbType, timeoutCallback: tcbType): void {
		this.startTimer(callback, timeoutCallback);
	}

	private startTimer(callback: cbType, timeoutCallback: tcbType) {
		let time = GameService.DEFAULT_GAME_TIME;
		this.clearTimer();

		this.timerInterval = setInterval(() => {
			time--;
			if (callback) callback(time);

			if (time <= 0) {
				this.handleTimeout(timeoutCallback);
			}
		}, 1000);
	}

	private handleTimeout(callback: tcbType) {
		this.clearTimer();

		this.switchTurn();

		if (this.isGameOver()) {
			callback(this.createGameOverResult());
		} else {
			callback(this.handleRoundEnd('draw'));
		}
	}

	private clearTimer() {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
			this.timerInterval = undefined;
		}
	}
}

export default GameService;
