import { useRef, useEffect } from "react"
import SocketProxy from "./game/client"
import { initGame } from "./game/gameloop";
import type { GameState } from "./types/GameTypes"
import { setupCommunications } from "./game/client";
import { useGame } from "../../contexts/gameContext";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

export const CANVAS_WIDTH = 1600;
export const CANVAS_HEIGHT = 1200;

const initGameState = (): GameState => {
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
		lastUpdateTime: 0,
		opponentDC: false,
		index: undefined
	})
}

const Pong = () => {
	const { apiClient } = useAuth();
	const { url, toggleConnection } = useGame();
	const socketProxy = useRef<SocketProxy>(SocketProxy.getInstance());
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const gameStateRef = useRef<GameState>(initGameState());

	useEffect(() => {
		try {
			if (!url) {
				return ;
			}
			gameStateRef.current.gameStatus = 'connecting';
			const disconnect = socketProxy.current.connect(url, apiClient);
			toggleConnection();
			return disconnect;
		}
		catch (err) {
			console.error('Unable to connect to game server: ', err);
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
