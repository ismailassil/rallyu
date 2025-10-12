import { useRef, useEffect } from "react"
import SocketProxy from "../utils/socketProxy"
import { initGame } from "./game/gameloop";
import type { GameState } from "./types/GameTypes"
import { setupCommunications } from "./game/comms";
import { GameMode, useGame } from "../../../../contexts/gameContext";

export const CANVAS_WIDTH = 1600;
export const CANVAS_HEIGHT = 1200;

const initGameState = (gameMode: GameMode): GameState => {
	return ({
		serverPlayerY: 600,
		serverBall: { x: 800, y: 600, width: 20, height: 20 },
		ball: { x: 800, y: 600, width: 20, height: 20 },
		players:[
			{
				rect: { x: 20, y: 600, width: 15, height: 100 },
				score: 0
			},
			{
				rect: { x: 1580, y: 600, width: 15, height: 100 },
				score: 0
			}
		],
		gameStatus: 'idle', // 'connecting', 'waiting', 'ready', 'playing', 'scored', 'gameover'
		gameMode,
		lastUpdateTime: 0,
		opponentDC: false,
		index: undefined
	})
}

const Pong = ({ socketProxy }: { socketProxy: SocketProxy }) => {
	const { updateGameState, gameState } = useGame();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const gameStateRef = useRef<GameState>(initGameState(gameState.gameMode));

	useEffect(() => {
		const stopGame = initGame(gameStateRef, canvasRef.current!, socketProxy);
		const unsubscribe = setupCommunications(gameStateRef, socketProxy, updateGameState);

		return () => {
			unsubscribe();
			if (stopGame) stopGame();
		}
	}, []);

	return (
		<canvas
			className='max-w-full max-h-full rounded-lg border shadow-xl border-neutral-700 bg-neutral-900/50' //border-neutral-700
			ref={canvasRef}
			width={CANVAS_WIDTH}
			height={CANVAS_HEIGHT}
			style={{ 
				width: 'auto',
				height: 'auto',
				maxWidth: '100%',
				maxHeight: '100%'
			}}
		/>
	)
}

export default Pong
