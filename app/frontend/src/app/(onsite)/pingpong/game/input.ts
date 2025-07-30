import type { GameState } from "../types/GameTypes"
import SocketProxy from "./client"

export const setupInputHandlers = (canvas: HTMLCanvasElement, gameState: GameState, proxy: SocketProxy): (() => void) => {
	const handleMouseMove = (event: MouseEvent) => {
		const rect = canvas.getBoundingClientRect();
		const mouseY = event.clientY - rect.top;
		const canvasY = mouseY * (canvas.height / rect.height);
		gameState.players[0].rect.y = canvasY;
		if (gameState.index !== undefined)
			proxy.send(JSON.stringify({ type: 'paddle', pid: gameState.index, y: canvasY }))
	}

	canvas.addEventListener('mousemove', handleMouseMove)

	return (() => {
		canvas.removeEventListener('mousemove', handleMouseMove)
	})
}