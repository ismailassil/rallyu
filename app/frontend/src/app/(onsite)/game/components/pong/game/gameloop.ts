import { GameState } from "../types/GameTypes"
import SocketProxy from "./client";
import { setupInputHandlers } from "./input"
import render from "./renderer"

let animationFrameId: number;

const lerp = (delayed: number, current: number, factor: number) => {
	return ((current - delayed) * factor)
}

const update = (gameState: GameState) => {
	/*
		this statement flips the view to the fixed left side of the screen
		for the right side player
	*/
	gameState.ball.x += lerp(gameState.ball.x, gameState.serverBall.x, 0.5)
	gameState.ball.y += lerp(gameState.ball.y, gameState.serverBall.y, 0.5)

	gameState.players[1].rect.y += lerp(
		gameState.players[1].rect.y,
		gameState.serverPlayerY,
		0.4
	)
}

export const initGame = (gameStateRef : React.RefObject<GameState>, canvas : HTMLCanvasElement, proxy: SocketProxy) => {
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		console.error('Failed to get context from canvas.');
		return ;
	}
	// canvas.style.maxWidth = '100%';
	// canvas.style.height = 'auto';
	const cleanUpInput = setupInputHandlers(canvas, gameStateRef.current, proxy);

	// setInterval(() => {
	// 	update(gameStateRef.current)
	// 	render(ctx, gameStateRef.current)
	// }, 1000 / 120)

	const gameLoop = (timestamp: DOMHighResTimeStamp) => {
		update(gameStateRef.current);
		render(ctx, gameStateRef.current);
		gameStateRef.current.lastUpdateTime = timestamp;
		animationFrameId = requestAnimationFrame(gameLoop);
	}
	animationFrameId = requestAnimationFrame(gameLoop);

	return () => {
		cancelAnimationFrame(animationFrameId);
		cleanUpInput();
	}
}