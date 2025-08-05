import type { GameState } from "../types/GameTypes"
import SocketProxy from "./client"
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