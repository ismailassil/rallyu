import { PongState, Coords, BallState, PongEventHandlers } from '@/app/(onsite)/game/types/types';
import SocketProxy from '@/app/(onsite)/game/utils/socketProxy'

class LocalXO {
    GAME_DURATION = 15000;
    state: XOState;
    animationFrameId: number | null;
    angles = [2.79253, 3.49066, 3.14159, 0, 0.34907, 5.93412];
    maxBounceAngle = 0.785398 
    gameTimeoutId: NodeJS.Timeout | undefined = undefined;
    gameStartTimeoutId: NodeJS.Timeout | undefined = undefined;
    countdown = 3000;
    remaining = this.GAME_DURATION;
    startTime: number | null = null;
    gamePlayStatus = 'countdown'; // pause, gameover, delay, play
    
    constructor(eventHandlers) {
        this.animationFrameId = null;
        this.state = {
            
        };
    }

    reset = () => {
        const initialAngle = this.angles[Math.floor(Math.random() * this.angles.length)];
        this.state = {};
        this.cleanupTimeouts();
        this.gamePlayStatus = 'countdown';
        this.eventHandlers?.updateOverlayStatus('none');
        this.gameStartTimeoutId = setTimeout(()=> {
            this.remaining = this.GAME_DURATION;
        }, this.countdown)
    }

    cleanupTimeouts = () => {
        clearTimeout(this.gameStartTimeoutId);
        clearTimeout(this.gameTimeoutId);
        this.gameStartTimeoutId = undefined;
        this.gameTimeoutId = undefined;
    }
}

export default LocalPong;