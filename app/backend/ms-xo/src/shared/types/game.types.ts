export type gameType = 'local' | 'online';

export type symbolType = 'cross' | 'circle';

export type plType = 'pl1' | 'pl2';

export type cbType = (timeLeft: number) => void;

export type tcbType = (data: any) => void;

export interface GameState {
	gameId: string;
	cells: string[];
	currentPlayer: plType;
	totalRounds: number;
	currentRound: number;
	score: { pl1: number; pl2: number };
}

export interface GameResult {
	status: 'going' | 'win' | 'draw' | 'gameOver' | 'invalid_move';
	winner?: plType | 'draw';
	cells?: string[];
	currentPlayer?: plType;
	states?: GameState;
}
