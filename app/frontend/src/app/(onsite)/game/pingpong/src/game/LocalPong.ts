import { PongState, Coords, BallState } from '@/app/(onsite)/game/types/PongTypes';
import SocketProxy from '@/app/(onsite)/game/utils/socketProxy'
import APong from "./APong";


class LocalPong extends APong {
    state: PongState;
    CANVAS_WIDTH = 1600
    CANVAS_HEIGHT = 1200
    animationFrameId: number | null;
    angles = [2.61799, 3.66519, 3.14159 ,0, 0.523599, 5.75959];
    maxBounceAngle = 0.785398 
    BALL_RADIUS = 10
    
    constructor() {
        super();
        this.animationFrameId = null;
        const initialAngle = this.angles[Math.floor(Math.random() * this.angles.length)];
        this.state = {
            ball: {
                x: 800,
                y: 600,
                speed: 14,
                angle: initialAngle,
                dir: 'left',
                velocity: this.getVelocity(initialAngle, 14)
            },
            players: [
                {
                    pos: { x: 20, y: 600 },
                    score: 0
                },
                {
                    pos: { x: 1580, y: 600 },
                    score: 0
                }
            ]
        };
    }

    private getVelocity = (angle: number, speed: number) => {
        return ({
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        })
    }

    private clamp = (value: number, min: number, max: number) => {
        return (Math.min(max, Math.max(min, value)))
    }
    
    private bounceBall = (ball: BallState, paddle: Coords) => {
        const relativeY = ball.y - paddle.y
        const normalized = relativeY / (this.PADDLE_HEIGHT / 2.0) // range -1.0, 1.0
        ball.angle = ball.dir === 'right'
            ? Math.PI - (normalized * this.maxBounceAngle)
            : normalized * this.maxBounceAngle
        ball.speed = this.clamp(ball.speed! * (Math.abs(normalized) * (0.7 - 0.3) + 0.7), 14, 19)
        ball.velocity = this.getVelocity(ball.angle, ball.speed)
        ball.dir = ball.dir === 'right' ? 'left' : 'right'
    }
    
    private paddleCollision = (ball: Coords, paddle: Coords) => {
        const dx = Math.abs(ball.x - paddle.x)
        const dy = Math.abs(ball.y - paddle.y)
    
        return(
            dx <= this.BALL_RADIUS + (this.PADDLE_WIDTH / 2) &&
            dy <= this.BALL_RADIUS + (this.PADDLE_HEIGHT / 2)
        )
    }
    
    private resetBall = (dir: 'left' | 'right') => {
        const side = dir === "left" ? 0 : this.angles.length / 2;
        const initialAngle = this.angles[side + Math.floor(Math.random() * (this.angles.length / 2))];
    
        return ({
            x: 800,
            y: 600,
            dir,
            speed: 14,
            angle: initialAngle,
            velocity: this.getVelocity(initialAngle, 14)
        })
    }
    
    private updateBall = () => {
        return ({
            x: this.state.ball.x + this.state.ball.velocity!.x,
            y: this.state.ball.y + this.state.ball.velocity!.y,
        })
    }
    
    private updateGame = () => {
        const newBall = this.updateBall()
    
        // check bounce off left paddle
        if (newBall.x < this.state.players[0].pos.x + 5 && this.paddleCollision(newBall, this.state.players[0].pos)) {
            this.state.ball.x = this.state.players[0].pos.x + 5
            return this.bounceBall(this.state.ball, this.state.players[0].pos)
        }
        
        // check bounce off right paddle
        if (newBall.x > this.state.players[1].pos.x - 5 && this.paddleCollision(newBall, this.state.players[1].pos)) {
            this.state.ball.x = this.state.players[1].pos.x - 5
            return this.bounceBall(this.state.ball, this.state.players[1].pos)
        }
        
        // top wall bounce
        if (newBall.y - this.BALL_RADIUS < 0) {
            this.state.ball.y = this.BALL_RADIUS
            this.state.ball.angle! *= -1
            this.state.ball.velocity!.y *= -1
            return
        }
    
        // bottom wall bounce
        if (newBall.y + this.BALL_RADIUS > 1200) {
            this.state.ball.y = 1200 - this.BALL_RADIUS
            this.state.ball.angle! *= -1
            this.state.ball.velocity!.y *= -1
            return
        }
    
        // right player scored
        if (this.state.ball.x < 0) {
            this.state.players[1].score++
            this.state.ball = this.resetBall("left")
            return
        }
        
        // left player scored
        if (this.state.ball.x > 1600) {
            this.state.players[0].score++
            this.state.ball = this.resetBall("right")
            return
        }
    
        this.state.ball.x = newBall.x
        this.state.ball.y = newBall.y
    }

    setupInputHandlers = (canvas: HTMLCanvasElement): (() => void) => {
        let animationFrameId: number;
        const keys = new Set<string>();
        const speed = 15;
    
        const handleKeyboardInput = () => {
            const p1 = this.state.players[0];
            const p2 = this.state.players[1];
    
            if (!p1 || !p2) return;
            
            if (keys.has('ArrowUp')) p2.pos.y -= speed;
            if (keys.has('ArrowDown')) p2.pos.y += speed;
    
            if (keys.has('w') || keys.has('W')) p1.pos.y -= speed;
            if (keys.has('s') || keys.has('S')) p1.pos.y += speed;
    
            p1.pos.y = Math.max(this.HALF_PADDLE, Math.min(p1.pos.y, canvas.height - this.HALF_PADDLE));
            p2.pos.y = Math.max(this.HALF_PADDLE, Math.min(p2.pos.y, canvas.height - this.HALF_PADDLE));
    
            animationFrameId = requestAnimationFrame(handleKeyboardInput);
        }
    
        const handleKeyUp = (event: KeyboardEvent) => {
            keys.delete(event.key);
        }
    
        const handleKeyDown = (event: KeyboardEvent) => {
            keys.add(event.key);
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        animationFrameId = requestAnimationFrame(handleKeyboardInput);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }

    initGame = (canvas : HTMLCanvasElement, proxy? : SocketProxy | null) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.log('Failed to get context from canvas.');
            return ;
        }
        const cleanUpInput = this.setupInputHandlers(canvas);
    
        const gameLoop = (timestamp: DOMHighResTimeStamp) => {
            this.updateGame();
            this.render(ctx, this.state);
            this.animationFrameId = requestAnimationFrame(gameLoop);
        }
        this.animationFrameId = requestAnimationFrame(gameLoop);
    
        return () => {
            cancelAnimationFrame(this.animationFrameId!);
            cleanUpInput();
        }
    }

}

export default LocalPong;