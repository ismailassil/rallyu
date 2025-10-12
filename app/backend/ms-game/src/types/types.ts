import type { WebSocket } from "ws";
import { TicTacToeRoom } from "../room/ticTacToeRoom";
import { PingPongRoom } from "../room/pingPongRoom";

export type GameType = 'pingpong' | 'tictactoe'
export type GameMode = 'online' | 'local'

export interface PingPongStatus {
	gameType: GameType,
	gameMode: GameMode,
	ball: BallState,
	players: [
		{
			ID?: number,
			score: number,
			coords: Coords
		},
		{
			ID?: number,
			score: number,
			coords: Coords
		}
	]
}

export interface TicTacToeStatus {
	gameType: GameType,
	gameMode: GameMode,
	cells: string[][],
	currentRound: number
	players: [
		{
			ID?: number,
			score: number,
		},
		{
			ID?: number,
			score: number,
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

export interface Coords {
	x: number;
	y: number;
}

export interface PingPongGameState {
	ball: BallState;
	players: Coords[];
	score: [number, number];
	pause: boolean;
}

export interface TicTacToeGameState {
	cells: string[][],
	currentRound: number,
	roundTimer: number,
	score: [number, number]
}

export interface Player<TRoom = Room<any, any>> {
	id: number;
	roomId: string;
	socket: WebSocket | null;
	connected: boolean;

	attachSocket(socket: WebSocket): void;
	detachSocket(): void;
	setupEventListeners(room: TRoom): void;
}

export interface Room<TState, TStatus> {
	id: string;
	gameType: GameType;
	gameMode: GameMode;
	startTime: number | null;
	players: Player[];
	running: boolean;
	timeoutId: NodeJS.Timeout | null;
	intervalId: NodeJS.Timeout | null;
	expirationTimer: NodeJS.Timeout | null;
	gameTimerId: NodeJS.Timeout | null;
	state: TState;

	attachPlayers(playersIds: number[]): void;
    setupPackets(): NodeJS.Timeout | void;
	sendGameOverPacket(): void;
	startGame(): void;
	getStatus(): TStatus;
	cleanUp(): void;
}
