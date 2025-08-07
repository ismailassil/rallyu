import { GameState } from "../types/GameTypes"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../Pong"

export const HALF_PADDLE = 30

export const render = (ctx: CanvasRenderingContext2D, gameState: GameState) => {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT) // clears the canvas
	ctx.fillStyle = 'white' // fill color
	ctx.strokeStyle = 'white' // stroke color
	
	ctx.font = '85px "AtariPongScore"';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(`${gameState.players[0].score}`, CANVAS_WIDTH * 0.3, 80)
	ctx.fillText(`${gameState.players[1].score}`, CANVAS_WIDTH * 0.71, 80)

	// player 1 paddle
	ctx.fillRect(
		gameState.players[0].rect.x - 5,
		gameState.players[0].rect.y - HALF_PADDLE,
		gameState.players[0].rect.width,
		gameState.players[0].rect.height
	)

	// player 2 paddle
	ctx.fillRect(
		gameState.players[1].rect.x - 5, // pos x
		gameState.players[1].rect.y - HALF_PADDLE, // pos y
		gameState.players[1].rect.width, // width
		gameState.players[1].rect.height // height
	)

	// dashed line
	ctx.setLineDash([10, 12]) // dash - gap
	ctx.lineWidth = 2
	ctx.beginPath() // resets the pen position
	ctx.moveTo(CANVAS_WIDTH / 2, 0) // moves the pen to a new position without drawing
	ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT) // draws line from prev pos to new pos and updates pos
	ctx.stroke() // sets the outline color to the previously set stroke color
	ctx.setLineDash([]) // resets the lineDash so that new drawn stuff doesn't draw line dash

	ctx.font = '24px "Serious2b"';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	ctx.beginPath();
	ctx.arc(
		gameState.ball.x,           // x position (center of the ball)
		gameState.ball.y,           // y position (center of the ball)
		gameState.ball.width / 2,   // radius (assuming width = height)
		0,                          // start angle
		2 * Math.PI                 // end angle (full circle)
	);
	ctx.fill();

	switch (gameState.gameStatus) {
		case 'connecting':
			ctx.fillText('Connecting...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
			break;
		case 'waiting':
			ctx.fillText('waiting for opponent...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
			break;
		case 'ready':
			ctx.fillText(
				'You', // ▼ | ctx.font = "30px sans-serif";
				gameState.players[0].rect.x,
				gameState.players[0].rect.y - 80
			)
			break;
		// default: | make the default case not do anything
	}
}

export default render