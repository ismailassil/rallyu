import type { WebSocket } from "ws";

export type GameType = 'PONG' | 'XO'
export type XOSign = 'X' | 'O' | ''

export interface PingPongStatus {
	gameType: GameType,
	ball: BallState,
	players: [
		{
			ID: number,
			score: number,
			coords: Coords,
			connected: boolean
		},
		{
			ID: number,
			score: number,
			coords: Coords,
			connected: boolean
		}
	]
}

export interface TicTacToeStatus {
	gameType: GameType;
	cells: string[];
	currentRound: number;
	currentPlayer: XOSign;
	players: [
		{
			ID: number,
			score: number,
			connected: boolean
		},
		{
			ID: number,
			score: number,
			connected: boolean
		}
	]
}

export interface BallState {
	x: number;
	y: number;
	speed: number;
	angle: number;
	dir: 'left' | 'right';
	velocity: { x: number; y: number };
}

export interface PongPlayerState {
	coords: Coords,
	movement: 'up' | 'down' | 'still',
	speed: number
}

export interface Coords {
	x: number;
	y: number;
}

export interface PingPongGameState {
	ball: BallState;
	players: PongPlayerState[];
	score: [number, number];
	pause: boolean;
}

export interface TicTacToeGameState {
	cells: XOSign[];
	currentRound: number;
	currentPlayer: XOSign;
}


export interface Player<TRoom = Room<any, any>> {
	id: number;
	roomId: string;
	socket: WebSocket | null;
	connected: boolean;
	sign?: XOSign;
	score?: number;

	attachSocket(socket: WebSocket): void;
	detachSocket(): void;
	setupEventListeners(room: TRoom): void;
}

export interface Room<TState, TStatus> {
	id: string;
	gameType: GameType;
	startTime: number | null;
	players: Player<any>[];
	running: boolean;
	timeoutId?: NodeJS.Timeout | undefined;
	intervalId?: NodeJS.Timeout | undefined;
	expirationTimer: NodeJS.Timeout | undefined;
	gameTimerId: NodeJS.Timeout | undefined;
	state: TState;

	attachPlayers(playersIds: number[]): void;
	startGame(): void;
	getStatus(): TStatus;
	cleanUp(): void;
	reconnect(player: Player): void;
}
