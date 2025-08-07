import { useRef, useEffect } from "react"
import SocketProxy from "./game/client"
import { initGame } from "./game/gameloop";
import type { GameState } from "./types/GameTypes"
import { setupCommunications } from "./game/client";
import { useGame } from "../../contexts/gameContext";

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
		gameStatus: 'idle', // 'connecting', 'waiting', 'ready', 'playing', 'scored', 'gameover'
		lastUpdateTime: 0,
		index: undefined
	})
}

const Pong = () => {
	const { url, toggleConnection } = useGame();
	const socketProxy = useRef<SocketProxy>(SocketProxy.getInstance());
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const gameStateRef = useRef<GameState>(initGameState());

	useEffect(() => {
		try {
			if (!url) {
				socketProxy.current.disconnect();
				return ;
			}
			gameStateRef.current.gameStatus = 'connecting';
			const disconnect = socketProxy.current.connect(url); // move this line to a button click (Queue)
			toggleConnection();
			return disconnect;
		}
		catch (_) {
			console.error('Unable to connect to game server');
		}
	}, [url])

	useEffect(() => {
		const stopGame = initGame(gameStateRef, canvasRef.current!, socketProxy.current);
		const unsubscribe = setupCommunications(gameStateRef, socketProxy.current);

		return () => {
			unsubscribe();
			if (stopGame) stopGame();
		}
	}, []);

	return (
		<div className="w-full max-h-[75vh] flex justify-center rounded-lg border border-white/10 bg-white/2">
			<canvas className='w-full aspect-[4/3] h-auto 2xl:max-w-[40vw] max-w-250 min-w-100 overflow-hidden rounded-lg border border-neutral-700/90 bg-neutral-900/50' ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
		</div>
	)
}

export default Pong
