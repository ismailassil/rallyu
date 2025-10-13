import { RemotePongState } from "@/app/(onsite)/game/types/PongTypes"
import SocketProxy from '@/app/(onsite)/game/utils/socketProxy'
import APong from "./APong";

class RemotePong extends APong {
    state: RemotePongState;
    animationFrameId: number | null;
    CANVAS_WIDTH = 1600
    CANVAS_HEIGHT = 1200
    
    constructor() {
        super();
        this.animationFrameId = null;
        this.state = {
            serverPlayerY: 600,
            serverBall: { x: 800, y: 600, width: 20, height: 20 },
            ball: { x: 800, y: 600 },
            players:[
                {
                    pos: { x: 20, y: 600 },
                    score: 0
                },
                {
                    pos: { x: 1580, y: 600 },
                    score: 0
                }
            ],
            gameStatus: 'idle', // 'connecting', 'waiting', 'ready', 'playing', 'scored', 'gameover'
            gameMode: 'remote',
            opponentDC: false,
            index: undefined
        };
    }

    private lerp = (delayed: number, current: number, factor: number) => {
        return ((current - delayed) * factor)
    }

    private updateGame = () => {
        this.state.ball.x += this.lerp(this.state.ball.x, this.state.serverBall.x, 0.5)
        this.state.ball.y += this.lerp(this.state.ball.y, this.state.serverBall.y, 0.5)
    
        this.state.players[1].pos.y += this.lerp(
            this.state.players[1].pos.y,
            this.state.serverPlayerY,
            0.4
        )
    }

    setupCommunications = (
        proxy: SocketProxy
        // setGameTime: React.Dispatch<React.SetStateAction<number>>,
        // setGameStarted: React.Dispatch<React.SetStateAction<boolean>>
    ): (() => void) => {
        return proxy.subscribe((data: any): void => {
            this.state.gameStatus = data.type
            switch (data.type) {
                case 'opp_left':
                    this.state.opponentDC = true;
                    break;
                case 'opp_joined':
                    this.state.opponentDC = false;
                    break;
                case 'reconnected':
                    this.state.index = data.i;
                    this.state.players[0].score = data.score[data.i]
                    this.state.players[1].score = data.score[data.i ^ 1]
                    // setGameTime(data.t);
                    break;
                case 'gameover':
                    this.state.serverBall = { x: 800, y: 600, width: 20, height: 20 };
                    proxy.disconnect();
                    // setGameTime(0);
                    // setGameStarted(false);
                    break;
                case 'ready':
                    this.state.index = data.i
                    // setGameTime(data.t);
                    break;
                case 'start':
                    // setGameTime(data.t);
                    break;
                case 'state':
                    this.state.serverBall = data.state.b
                    if (this.state.index === 1)
                        this.state.serverBall.x = 1600 - this.state.serverBall.x;
                    this.state.serverPlayerY = data.state.p
                    this.state.players[0].score = data.state.s[0]
                    this.state.players[1].score = data.state.s[1]
                    break;
            }
        })
    }

    private setupInputHandlers = (canvas: HTMLCanvasElement, proxy: SocketProxy): (() => void) => {
        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseY = event.clientY - rect.top;
            const canvasY = mouseY * (canvas.height / rect.height);
            const boundedY = Math.max(this.HALF_PADDLE, Math.min(canvasY, canvas.height) - this.HALF_PADDLE);
            
            this.state.players[0].pos.y = boundedY;
            if (this.state.index !== undefined)
                proxy.send(JSON.stringify({ type: 'paddle', pid: this.state.index, y: boundedY }));
        }
        window.addEventListener('mousemove', handleMouseMove);
    
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }

    initGame = (canvas : HTMLCanvasElement, proxy: SocketProxy) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.log('Failed to get context from canvas.');
            return ;
        }

        const cleanUpInput = this.setupInputHandlers(canvas, proxy);
        const cleanUpComms = this.setupCommunications(proxy);
    
        const gameLoop = (timestamp: DOMHighResTimeStamp) => {
            this.updateGame();
            this.render(ctx, this.state);
            this.animationFrameId = requestAnimationFrame(gameLoop);
        }
        this.animationFrameId = requestAnimationFrame(gameLoop);
    
        return () => {
            cancelAnimationFrame(this.animationFrameId!);
            cleanUpInput();
            cleanUpComms();
        }
    }

}

export default RemotePong;