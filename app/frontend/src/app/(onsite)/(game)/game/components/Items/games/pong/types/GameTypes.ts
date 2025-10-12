import { GameMode } from "@/app/(onsite)/(game)/game/contexts/gameContext"

export interface Rect {
	x: number,
	y: number,
	width: number,
	height: number
}

export interface GameState {
	serverPlayerY: number,
	serverBall: Rect,
	ball: Rect,
	players:[
		{
			rect: Rect,
			score: number
		},
		{
			rect: Rect,
			score: number
		}
	],
	gameStatus: string, // 'waiting', 'ready', 'playing', 'scored', 'gameover'
	gameMode: GameMode,
	opponentDC: boolean,
	lastUpdateTime: number,
	index: number | undefined
}