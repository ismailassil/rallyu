import { useRef, useEffect } from "react"
import SocketProxy from "../game/client"
import { initGame } from "../game/gameloop";
import type { GameState } from "../types/GameTypes"
import { setupCommunications } from "../game/client";

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

const initGameState = (): GameState => {
	return ({
		serverPlayerY: 300,
		serverBall: { x: 400, y: 300, width: 10, height: 10 },
		ball: { x: 400, y: 300, width: 10, height: 10 },
		players:[
			{
				rect: { x: 35, y: 300, width: 10, height: 60 },
				score: 0
			},
			{
				rect: { x: 765, y: 300, width: 10, height: 60 },
				score: 0
			}
		],
		gameStatus: 'connecting', // 'waiting', 'ready', 'playing', 'scored', 'gameover'
		lastUpdateTime: 0,
		index: undefined
	})
}

const Pong = () => {
	const socketProxy = useRef<SocketProxy>(SocketProxy.getInstance());
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const gameStateRef = useRef<GameState>(initGameState());

	useEffect(() => {
		const stopGame = initGame(gameStateRef, canvasRef.current!, socketProxy.current);
		const disconnect = socketProxy.current.connect("ws://localhost:3001/game/queue"); // move this line to a button click (Queue)
		const unsubscribe = setupCommunications(gameStateRef, socketProxy.current);

		return () => {
			unsubscribe();
			disconnect();
			if (stopGame) stopGame();
		}
	}, []);

	return (
		<>
			<canvas className='gameCanvas max-w-full rounded-lg border border-neutral-700 bg-neutral-900' ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
			{/* <canvas className='gameCanvas max-w-full max-h-full max-sm:h-full max-sm:w-full rounded-lg border border-neutral-700 bg-neutral-900' ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} /> */}
		</>
	)
}

export default Pong
