import { BallState, Coords, PingPongGameState } from "../types/types";

const maxBounceAngle = 0.785398 // RAD / 45 degrees
const PADDLE_WIDTH = 15
const PADDLE_HEIGHT = 100
const BALL_RADIUS = 10
export const angles = [2.61799, 3.66519, 3.14159 ,0, 0.523599, 5.75959];

const clamp = (value: number, min: number, max: number) => {
	return (Math.min(max, Math.max(min, value)))
}

const bounceBall = (ball: BallState, paddle: Coords) => {
	const relativeY = ball.y - paddle.y
	const normalized = relativeY / (PADDLE_HEIGHT / 2.0) // range -1.0, 1.0
	ball.angle = ball.dir === 'right'
		? Math.PI - (normalized * maxBounceAngle)
		: normalized * maxBounceAngle
	ball.speed = clamp(ball.speed * (Math.abs(normalized) * (0.7 - 0.3) + 0.7), 14, 19)
	ball.velocity = getVelocity(ball.angle, ball.speed)
	ball.dir = ball.dir === 'right' ? 'left' : 'right'
}

export const getVelocity = (angle: number, speed: number) => {
	return ({
		x: Math.cos(angle) * speed,
		y: Math.sin(angle) * speed
	})
}

const paddleCollision = (ball: Coords, paddle: Coords) => {
	const dx = Math.abs(ball.x - paddle.x)
	const dy = Math.abs(ball.y - paddle.y)

	return(
		dx <= BALL_RADIUS + (PADDLE_WIDTH / 2) &&
		dy <= BALL_RADIUS + (PADDLE_HEIGHT / 2)
	)
}

const resetBall = (dir: 'left' | 'right') => {
	const side = dir === "left" ? 0 : angles.length / 2;
	const initialAngle = angles[side + Math.floor(Math.random() * (angles.length / 2))];

	return ({
		x: 800,
		y: 600,
		dir,
		speed: 14,
		angle: initialAngle,
		velocity: getVelocity(initialAngle, 14)
	})
}

const updateBall = (ball: BallState) => {
	return ({
		x: ball.x + ball.velocity.x,
		y: ball.y + ball.velocity.y,
	})
}

export const updateState = (gameState: PingPongGameState) => {
	const newBall: Coords = updateBall(gameState.ball)

	// check bounce off left paddle
	if (newBall.x < gameState.players[0].x + 5 && paddleCollision(newBall, gameState.players[0])) {
		gameState.ball.x = gameState.players[0].x + 5
		return bounceBall(gameState.ball, gameState.players[0])
	}
	
	// check bounce off right paddle
	if (newBall.x > gameState.players[1].x - 5 && paddleCollision(newBall, gameState.players[1])) {
		gameState.ball.x = gameState.players[1].x - 5
		return bounceBall(gameState.ball, gameState.players[1])
	}
	
	// top wall bounce
	if (newBall.y - BALL_RADIUS < 0) {
		gameState.ball.y = BALL_RADIUS
		gameState.ball.angle *= -1
		gameState.ball.velocity.y *= -1
		return
	}

	// bottom wall bounce
	if (newBall.y + BALL_RADIUS > 1200) {
		gameState.ball.y = 1200 - BALL_RADIUS
		gameState.ball.angle *= -1
		gameState.ball.velocity.y *= -1
		return
	}

	// right player scored
	if (newBall.x < 0) {
		gameState.score[1]++
		gameState.ball = resetBall("left")
		gameState.pause = true
		setTimeout(() => gameState.pause = false, 1000)
		return
	}
	
	// left player scored
	if (newBall.x > 1600) {
		gameState.score[0]++
		gameState.ball = resetBall("right")
		gameState.pause = true
		setTimeout(() => gameState.pause = false, 1000)
		return
	}

	gameState.ball.x = newBall.x
	gameState.ball.y = newBall.y
}

module.exports = {
	updateState,
	getVelocity,
	angles
}