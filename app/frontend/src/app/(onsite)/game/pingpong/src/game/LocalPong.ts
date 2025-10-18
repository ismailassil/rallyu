import { PongState, Coords, BallState, EventHandlers } from '@/app/(onsite)/game/types/types';
import SocketProxy from '@/app/(onsite)/game/utils/socketProxy'
import APong from "./APong";


class LocalPong extends APong {
    GAME_DURATION = 30000;
    state: PongState;
    animationFrameId: number | null;
    angles = [2.79253, 3.49066, 3.14159, 0, 0.34907, 5.93412];
    maxBounceAngle = 0.785398 
    gameTimeoutId: NodeJS.Timeout | undefined = undefined;
    gameStartTimeoutId: NodeJS.Timeout | undefined = undefined;
    countdown = 3000;
    remaining = this.GAME_DURATION;
    startTime: number | null = null;
    gamePlayStatus = 'countdown'; // pause, gameover, delay, play
    
    constructor(private eventHandlers?: EventHandlers) {
        super();
        this.animationFrameId = null;
        const initialAngle = this.angles[Math.floor(Math.random() * this.angles.length)];
        this.state = {
            ball: {
                x: 800,
                y: 450,
                speed: 14,
                angle: initialAngle,
                dir: Math.random() > 0.5 ? 'right' : 'left',
                velocity: this.getVelocity(initialAngle, 14)
            },
            players: [
                {
                    pos: { x: 20, y: 450 },
                    score: 0
                },
                {
                    pos: { x: 1580, y: 450 },
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
            y: 450,
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
        if (newBall.y + this.BALL_RADIUS > this.CANVAS_HEIGHT) {
            this.state.ball.y = 900 - this.BALL_RADIUS
            this.state.ball.angle! *= -1
            this.state.ball.velocity!.y *= -1
            return
        }
    
        // right player scored
        if (this.state.ball.x < 0) {
            this.state.players[1].score++
            this.state.ball = this.resetBall("left")
		    this.gamePlayStatus = 'delay'
		    setTimeout(() => {
                if (this.gamePlayStatus === 'delay')
                    this.gamePlayStatus = 'play';
            }, 1200)
            return
        }
        
        // left player scored
        if (this.state.ball.x > this.CANVAS_WIDTH) {
            this.state.players[0].score++
            this.state.ball = this.resetBall("right")
            this.gamePlayStatus = 'delay'
		    setTimeout(() => {
                if (this.gamePlayStatus === 'delay')
                    this.gamePlayStatus = 'play';
            }, 1200)
            return
        }
    
        this.state.ball.x = newBall.x
        this.state.ball.y = newBall.y
    }

    setupInputHandlers = (canvas: HTMLCanvasElement): (() => void) => {
        let animationFrameId: number;
        const keys = new Set<string>();
        const speed = 12;
    
        const handleKeyboardInput = () => {
            if (this.gamePlayStatus === 'pause')  {
                animationFrameId = requestAnimationFrame(handleKeyboardInput);
                return;
            }

            const p1 = this.state.players[0];
            const p2 = this.state.players[1];
            
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

    pauseGame = () => {
        if (this.gamePlayStatus === 'play' || this.gamePlayStatus === 'delay') {
            this.gamePlayStatus = 'pause';
            this.remaining -= Date.now() - this.startTime!;
            this.eventHandlers?.updateOverlayStatus('pause');
            this.eventHandlers?.updateTimer(this.remaining);
            this.cleanupTimeouts();
        } else if (this.gamePlayStatus === 'pause') {
            this.eventHandlers?.updateOverlayStatus('none');
            this.startGameTimer();
        }
    }

    startGameTimer = () => {
        this.startTime = Date.now();
        this.gamePlayStatus = 'play';
        this.eventHandlers?.updateTimer(this.remaining); // TODO
        this.gameTimeoutId = setTimeout(() => {
            this.eventHandlers?.updateOverlayStatus('gameover');
            this.gamePlayStatus = 'gameover';
        }, this.remaining);
    }

    reset = () => {
        const initialAngle = this.angles[Math.floor(Math.random() * this.angles.length)];
        this.state = {
            ball: {
                x: 800,
                y: 450,
                speed: 14,
                angle: initialAngle,
                dir: Math.random() > 0.5 ? 'left' : 'right',
                velocity: this.getVelocity(initialAngle, 14)
            },
            players: [
                {
                    pos: { x: 20, y: 450 },
                    score: 0
                },
                {
                    pos: { x: 1580, y: 450 },
                    score: 0
                }
            ]
        };
        this.cleanupTimeouts();
        this.gamePlayStatus = 'countdown';
        this.eventHandlers?.updateOverlayStatus('none');
        this.eventHandlers?.updateTimer(this.countdown);
        this.gameStartTimeoutId = setTimeout(()=> {
            this.remaining = this.GAME_DURATION;
            this.startGameTimer()
        }, this.countdown)
    }

    cleanupTimeouts = () => {
        clearTimeout(this.gameStartTimeoutId);
        clearTimeout(this.gameTimeoutId);
        this.gameStartTimeoutId = undefined;
        this.gameTimeoutId = undefined;
    }

    initGame = (canvas : HTMLCanvasElement, proxy? : SocketProxy | null) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.log('Failed to get context from canvas.');
            return ;
        }
        const cleanUpInput = this.setupInputHandlers(canvas);
    

        const gameLoop = () => {
            if (this.gamePlayStatus === 'play') this.updateGame();
            this.render(ctx, this.state);
            this.animationFrameId = requestAnimationFrame(gameLoop);
        }
        this.animationFrameId = requestAnimationFrame(gameLoop);
        
        this.eventHandlers?.updateTimer(this.countdown);
        this.gameStartTimeoutId = setTimeout(()=> {
            this.startGameTimer()
        }, this.countdown);

       
    
        return () => {
            cancelAnimationFrame(this.animationFrameId!);
            cleanUpInput();
            this.cleanupTimeouts();
        }
    }

}

export default LocalPong;