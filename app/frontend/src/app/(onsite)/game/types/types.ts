export type GameType = 'pingpong' | 'tictactoe';
export type GameMode = 'remote' | 'local';

export type XOSign = 'X' | 'O' | ''

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

export interface EventHandlers {
	updateTimer: React.Dispatch<React.SetStateAction<number>>;
	updateOverlayStatus: React.Dispatch<React.SetStateAction<string>>;
	updateConnection?: React.Dispatch<React.SetStateAction<boolean>>;
	updateRound?: React.Dispatch<React.SetStateAction<number>>;
	updateBoard?: React.Dispatch<React.SetStateAction<XOSign[]>>;
	updateScore?: React.Dispatch<React.SetStateAction<[number, number]>>; 

}

export interface RemotePongState extends PongState {
	serverOpponentY: number,
	serverPlayerY: number,
	serverBall: Coords,
	gameStatus: string, // 'waiting', 'ready', 'playing', 'scored', 'gameover'
	gameMode: GameMode,
	index: number | undefined
}

export interface XOState {
	cells: XOSign[];
	currentRound: number;
	currentPlayer: XOSign;
	mySign: XOSign,
	score: [number, number]
}