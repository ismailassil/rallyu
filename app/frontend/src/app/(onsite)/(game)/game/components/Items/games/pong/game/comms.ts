import type { GameState } from "../types/GameTypes"
import { GameContextState } from '@/app/(onsite)/(game)/game/contexts/gameContext';
import SocketProxy from "../../utils/socketProxy"
import { HALF_PADDLE } from "./renderer"

export const setupInputHandlers = (canvas: HTMLCanvasElement, gameState: GameState, proxy: SocketProxy): (() => void) => {
	let animationFrameId: number;
	const keys = new Set<string>();
	const speed = 10;

	const handleMouseMove = (event: MouseEvent) => {
		const rect = canvas.getBoundingClientRect();
		const mouseY = event.clientY - rect.top;
		const canvasY = mouseY * (canvas.height / rect.height);
		const boundedY = Math.max(HALF_PADDLE, Math.min(canvasY, canvas.height) - HALF_PADDLE);
		
		gameState.players[0].rect.y = boundedY;
		if (gameState.index !== undefined)
			proxy.send(JSON.stringify({ type: 'paddle', pid: gameState.index, y: boundedY }));
	}

	const handleKeyboardInput = () => {
		const p1 = gameState.players[0];
		const p2 = gameState.players[1];

		if (!p1 || !p2) return;

		if (keys.has('w') || keys.has('W')) p1.rect.y += speed;
		if (keys.has('s') || keys.has('S')) p1.rect.y -= speed;

		if (keys.has('ArrowUp')) p2.rect.y += speed;
		if (keys.has('ArrowDown')) p2.rect.y -= speed;

		p1.rect.y = Math.max(HALF_PADDLE, Math.min(p1.rect.y, canvas.height - HALF_PADDLE));
    	p2.rect.y = Math.max(HALF_PADDLE, Math.min(p2.rect.y, canvas.height - HALF_PADDLE));

		proxy.send(JSON.stringify({
			type: "paddle",
			pos: [
				p1.rect.y,
				p2.rect.y
			]
		}));

		animationFrameId = requestAnimationFrame(handleKeyboardInput);
	}

	const handleKeyUp = (event: KeyboardEvent) => {
		keys.delete(event.key);
	}

	const handleKeyDown = (event: KeyboardEvent) => {
		keys.add(event.key);
	}

	window.addEventListener('mousemove', handleMouseMove);
	if (gameState.gameMode === 'local') {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		animationFrameId = requestAnimationFrame(handleKeyboardInput);
	}

	return () => {
		window.removeEventListener("mousemove", handleMouseMove);
		if (gameState.gameMode === 'local') {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			cancelAnimationFrame(animationFrameId);
		}
	  };
}

export const setupCommunications = (
	gameStateRef: React.RefObject<GameState>,
	proxy: SocketProxy,
	updateGameState: (updates: Partial<GameContextState>) => void
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
				updateGameState({
					gameTime: data.time
				})
				break;
			case 'gameover':
				gameStateRef.current.serverBall = { x: 800, y: 600, width: 20, height: 20 };
				proxy.disconnect();
				updateGameState({
					gameStarted: false,
					gameTime: 0
				})
				break;
			case 'ready':
				gameStateRef.current.index = data.i
				updateGameState({
					gameTime: 3
				})
				break;
			case 'start':
				updateGameState({
					gameTime: 90
				})
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