export type MessageCallBack = (message: any) => void;

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
	gameStatus: string, // 'connecting', 'waiting', 'ready', 'playing', 'scored', 'gameover'
	lastUpdateTime: number,
	index: number | undefined
}