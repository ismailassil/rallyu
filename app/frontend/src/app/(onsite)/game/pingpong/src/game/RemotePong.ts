import { PongEventHandlers, RemotePongState } from "@/app/(onsite)/game/types/PongTypes"
import SocketProxy from '@/app/(onsite)/game/utils/socketProxy'
import APong from "./APong";

class RemotePong extends APong {
    state: RemotePongState;
    animationFrameId: number | null;
    
    constructor(private proxy: SocketProxy, private eventHandlers?: PongEventHandlers) {
        super();
        this.animationFrameId = null;
        this.state = {
            serverOpponentY: 450,
            serverPlayerY: 450,
            serverBall: { x: 800, y: 450 },
            ball: { x: 800, y: 450 },
            players:[
                {
                    pos: { x: 20, y: 450 },
                    score: 0
                },
                {
                    pos: { x: 1580, y: 450 },
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
        this.state.ball.x += this.lerp(this.state.ball.x, this.state.serverBall.x, 0.4)
        this.state.ball.y += this.lerp(this.state.ball.y, this.state.serverBall.y, 0.4)
    
        this.state.players[0].pos.y += this.lerp(
            this.state.players[0].pos.y,
            this.state.serverPlayerY,
            0.4
        )

        this.state.players[1].pos.y += this.lerp(
            this.state.players[1].pos.y,
            this.state.serverOpponentY,
            0.4
        )
    }

    setupCommunications = (): (() => void) => {
        return this.proxy.subscribe((data: any): void => {
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
                    this.eventHandlers?.updateTimer!(data.t);
                    break;
                case 'gameover':
                    this.state.serverBall = { x: 800, y: 450 };
                    this.proxy.disconnect();
                    this.eventHandlers?.updateTimer!(0);
                    break;
                case 'ready':
                    this.state.index = data.i
                    this.eventHandlers?.updateTimer!(data.t);
                    break;
                case 'start':
                    this.eventHandlers?.updateTimer!(data.t);
                    break;
                case 'state':
                    this.state.serverBall = data.state.b
                    if (this.state.index === 1)
                        this.state.serverBall.x = 1600 - this.state.serverBall.x;
                    this.state.serverOpponentY = data.state.opp
                    this.state.serverPlayerY = data.state.p
                    this.state.players[0].score = data.state.s[this.state.index!]
                    this.state.players[1].score = data.state.s[this.state.index! ^ 1]
                    break;
                case 'forfeit':
                    this.proxy.disconnect();
                    
                    break;
            }
        })
    }

    private setupInputHandlers = (): (() => void) => {
        const handleKeyUp = (ev: KeyboardEvent) => {
            if (ev.key === "ArrowUp" || ev.key === "ArrowDown")
                this.proxy.send(JSON.stringify({ type: "move", dir: "still", pid: this.state.index }));
        }

        const handleKeyDown = (ev: KeyboardEvent) => {
            if (ev.key === "ArrowUp")
                this.proxy.send(JSON.stringify({ type: "move", dir: "up", pid: this.state.index }));
            else if (ev.key === "ArrowDown")
                this.proxy.send(JSON.stringify({ type: "move", dir: "down", pid: this.state.index }));
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
    
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }

    forfeit = () => {
        this.proxy.send({ type: 'forfeit', pid: this.state.index });
        this.eventHandlers?.updateOverlayStatus('gameover');
        this.eventHandlers?.updateTimer(0);
    }

    initGame = (canvas : HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.log('Failed to get context from canvas.');
            return ;
        }

        const cleanUpComms = this.setupCommunications();
        const cleanUpInput = this.setupInputHandlers();
    
        const gameLoop = () => {
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