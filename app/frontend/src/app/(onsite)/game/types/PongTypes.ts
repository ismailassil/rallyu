export type GameType = 'pingpong' | 'tictactoe';
export type GameMode = 'remote' | 'local';

export interface Rect {
	x: number,
	y: number,
	width: number,
	height: number
}

export interface Coords {
	x: number;
	y: number;
}

export interface BallState {
	x: number;
	y: number;
	speed?: number;
	angle?: number;
	dir?: 'left' | 'right';
	velocity?: { x: number; y: number };
}

export interface PongState {
	ball: BallState,
	players:[
		{
			pos: Coords,
			score: number
		},
		{
			pos: Coords,
			score: number
		}
	],
}

export interface RemotePongState extends PongState {
	serverPlayerY: number,
	serverBall: Rect,
	gameStatus: string, // 'waiting', 'ready', 'playing', 'scored', 'gameover'
	gameMode: GameMode,
	opponentDC: boolean,
	index: number | undefined
}