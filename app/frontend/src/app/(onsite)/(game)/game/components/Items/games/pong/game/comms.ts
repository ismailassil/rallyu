import type { GameState } from "../types/GameTypes"
import SocketProxy from "../../utils/socketProxy"
import { HALF_PADDLE } from "./renderer"

export const setupInputHandlers = (canvas: HTMLCanvasElement, gameState: GameState, proxy: SocketProxy): (() => void) => {
	const handleMouseMove = (event: MouseEvent) => {
		const rect = canvas.getBoundingClientRect();
		const mouseY = event.clientY - rect.top;
		const canvasY = mouseY * (canvas.height / rect.height);
		const boundedY = Math.max(HALF_PADDLE, Math.min(canvasY, canvas.height) - HALF_PADDLE);
		
		gameState.players[0].rect.y = boundedY;
		if (gameState.index !== undefined)
			proxy.send(JSON.stringify({ type: 'paddle', pid: gameState.index, y: boundedY }));
	}

	window.addEventListener('mousemove', handleMouseMove);

	return (() => {
		window.removeEventListener('mousemove', handleMouseMove);
	})
}

export const setupCommunications = (
	gameStateRef: React.RefObject<GameState>,
	proxy: SocketProxy,
	setGameTime: React.Dispatch<React.SetStateAction<number>>
): (() => void) => {
	return proxy.subscribe((data: any): void => {
		gameStateRef.current.gameStatus = data.type
		switch (data.type) {
			case 'opp_left':
				gameStateRef.current.opponentDC = true;
				break;
			case 'opp_joined':
				gameStateRef.current.opponentDC = false;
				break;
			case 'reconnected':
				gameStateRef.current.index = data.i;
				gameStateRef.current.players[0].score = data.score[0]
				gameStateRef.current.players[1].score = data.score[1]
				setGameTime(data.time);
				break;
			case 'gameover':
				gameStateRef.current.serverBall = { x: 800, y: 600, width: 20, height: 20 };
				proxy.disconnect();
				setGameTime(0);
				break;
			case 'ready':
				gameStateRef.current.index = data.i
				setGameTime(3);
				break;
			case 'start':
				setGameTime(90);
				break;
			case 'state':
				gameStateRef.current.serverBall = data.state.b
				if (gameStateRef.current.index === 1)
					gameStateRef.current.serverBall.x = 1600 - gameStateRef.current.serverBall.x;
				gameStateRef.current.serverPlayerY = data.state.p
				gameStateRef.current.players[0].score = data.state.s[0]
				gameStateRef.current.players[1].score = data.state.s[1]
				break;
		}
	})
}