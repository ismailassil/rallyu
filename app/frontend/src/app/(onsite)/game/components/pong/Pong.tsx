import { useRef, useEffect } from "react"
import SocketProxy from "./game/client"
import { initGame } from "./game/gameloop";
import type { GameState } from "./types/GameTypes"
import { setupCommunications } from "./game/client";
import { useGame } from "../../contexts/gameContext";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

const initGameState = (): GameState => {
	return ({
		serverPlayerY: 300,
		serverBall: { x: 400, y: 300, width: 10, height: 10 },
		ball: { x: 400, y: 300, width: 10, height: 10 },
		players:[
			{
				rect: { x: 20, y: 300, width: 10, height: 60 },
				score: 0
			},
			{
				rect: { x: 780, y: 300, width: 10, height: 60 },
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
			className='max-w-full rounded-lg border border-neutral-700 bg-neutral-900/50'
			ref={canvasRef}
			width={CANVAS_WIDTH}
			height={CANVAS_HEIGHT}
		/>
	)
}

export default Pong
