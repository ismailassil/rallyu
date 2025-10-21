import { EventHandlers, XOSign, XOState } from '@/app/(onsite)/game/types/types';

class LocalXO {
    GAME_DURATION = 15000;
    TOTAL_ROUNDS: number = 3;
    TURN_TIMEOUT: number = 15000;
    COUNTDOWN_TIME: number = 3000;
    WINNING_COMBOS: number[][] = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ] as const;
    state: XOState;
    turnTimeoutId: NodeJS.Timeout | undefined = undefined;
    countdownId: NodeJS.Timeout | undefined = undefined;
	startOfRoundPlayer: XOSign;
	status: string; // countdown gameover play
    
    
    constructor(private eventHandlers?: EventHandlers) {
		this.status = 'countdown'
		this.startOfRoundPlayer = Math.random() > 0.5 ? 'X' : 'O'
        this.state = {
			cells: ['', '', '', '', '', '', '', '', ''],
			currentRound: 1,
			currentPlayer: this.startOfRoundPlayer,
            players: [
                {
                    sign: this.startOfRoundPlayer,
                    score: 0
                },
                {
                    sign: this.startOfRoundPlayer === 'X' ? 'O' : 'X',
                    score: 0
                },
            ]
		};
    }

    markCell(move: number): boolean {
		if (this.status !== 'play' || (move < 0 || move > 9 || this.state.cells[move] !== ''))
			return false;

		this.state.cells[move] = this.state.currentPlayer;
		this.state.currentPlayer = this.state.currentPlayer === 'X' ? 'O' : 'X';
        this.eventHandlers?.updateBoard!(this.state.cells);

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
		for (const [a, b, c] of this.WINNING_COMBOS) {
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
		const winnerPlayer = this.state.players!.find(p => p.sign === winner);
		if (winnerPlayer) {
			winnerPlayer.score++;
		}

        this.eventHandlers?.updateScore!([this.state.players![0].score, this.state.players![1].score])
		this.state.currentRound++;
		
		if (this.state.currentRound > this.TOTAL_ROUNDS) {
			this.handleGameOver();
		} else {
			this.startRound();
		}
	}
	
	private handleDraw(): void {
		this.state.currentRound++;
		
		if (this.state.currentRound > this.TOTAL_ROUNDS) {
			this.handleGameOver();
		} else {
			this.startRound();
		}
	}
	
	private handleGameOver(): void {
		const overallWinner = this.determineOverallWinner();
		this.status = 'gameover'
		this.eventHandlers?.updateOverlayStatus('gameover');
		this.eventHandlers?.updateTimer(0);
		let displayedResult;
		switch (overallWinner) {
			case 'draw':
				displayedResult = 'Draw';
				break;
			case 'X':
				displayedResult = 'Cross Wins';
				break;
			case 'O':
				displayedResult = 'Circle Wins';
				break;
			default : 
				displayedResult = 'Game Over';
		}
		this.eventHandlers?.updateDisplayedResult!(displayedResult);
	}
	
	private startRound(): void {
		this.status = 'countdown'
        this.eventHandlers?.updateOverlayStatus('countdown');
        this.eventHandlers?.updateTimer(this.COUNTDOWN_TIME);
        this.eventHandlers?.updateRound!(this.state.currentRound);
        this.startOfRoundPlayer = this.startOfRoundPlayer === 'X' ? 'O' : 'X';
		this.state.currentPlayer = this.startOfRoundPlayer;

		clearTimeout(this.countdownId)
		this.countdownId = setTimeout(() => {
			this.status = 'play'
			this.eventHandlers?.updateOverlayStatus('play');
			this.resetBoard();
			this.resetTurnTimer();
		}, this.COUNTDOWN_TIME);
	}
	
	private resetBoard(): void {
		this.state.cells = Array(9).fill('');
        this.eventHandlers?.updateBoard!(this.state.cells);
	}
	
	private resetTurnTimer(): void {
		clearTimeout(this.turnTimeoutId);
        this.eventHandlers?.updateCurrentPlayer!(this.state.currentPlayer);
        this.eventHandlers?.updateTimer!(prev => prev === this.TURN_TIMEOUT ? this.TURN_TIMEOUT - 1 : this.TURN_TIMEOUT);
		this.turnTimeoutId = setTimeout(() => {
			this.handleTurnTimeout();
		}, this.TURN_TIMEOUT);
	}
	
	private handleTurnTimeout(): void {
		const winnerSign = this.state.currentPlayer === 'X' ? 'O' : 'X';
		this.handleWin(winnerSign);
	}
	
	private determineOverallWinner(): XOSign | 'draw' {
		const [player1, player2] = this.state.players!;
		if (player1.score > player2.score) return player1.sign;
		if (player2.score > player1.score) return player2.sign;
		return 'draw';
	}

	init(): void {
		this.startRound();
	}

	cleanUp(): void {
		clearTimeout(this.turnTimeoutId);
		clearTimeout(this.countdownId);
	}

    reset = () => {
		if (this.status === 'countdown')
			return;
        this.cleanUp();
        this.resetBoard();
		this.eventHandlers?.updateOverlayStatus('none')
		this.startOfRoundPlayer = Math.random() > 0.5 ? 'X' : 'O'; 
        this.state = {
			...this.state,
            currentRound: 1,
			currentPlayer: this.startOfRoundPlayer,
            players: [
                {
                    sign: this.startOfRoundPlayer,
                    score: 0
                },
                {
                    sign: this.startOfRoundPlayer === 'X' ? 'O' : 'X',
                    score: 0
                },
            ]
        }
        this.eventHandlers?.updateScore!([this.state.players![0].score, this.state.players![1].score])
        this.eventHandlers?.updateCurrentPlayer!(this.state.currentPlayer);
		this.startRound();
    }
}

export default LocalXO;