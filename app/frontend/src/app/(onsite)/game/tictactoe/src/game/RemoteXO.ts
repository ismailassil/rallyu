import { EventHandlers, XOState } from "@/app/(onsite)/game/types/types"
import SocketProxy from '@/app/(onsite)/game/utils/socketProxy'

class RemoteXO {
    state: XOState;
    
    constructor(private proxy: SocketProxy, private eventHandlers?: EventHandlers) {
        this.state = {
            cells: ['', '', '', '', '', '', '', '', ''],
			currentRound: 1,
			currentPlayer: '',
			mySign: '',
			score: [0, 0]
        };
    }

    setupCommunications = (): (() => void) => {
        return this.proxy.subscribe((data: any): void => {
            switch (data.type) {
                case 'opp_left':
                    this.eventHandlers?.updateConnection!(true);
                    break;
                case 'opp_joined':
                    this.eventHandlers?.updateConnection!(false);
                    break;
                case 'reconnected':
					this.state.mySign = data.sign;
                    this.state.score = data.score;
					this.state.currentPlayer = data.currentPlayer;
					this.state.currentRound = data.currentRound;
                    // this.eventHandlers?.updateTimer!(data.t);
                    break;
                case 'ready':
                    this.state.mySign = data.sign
                    break;
                case 'round_start':
					this.state.currentRound = data.round;
					this.state.currentPlayer = data.currentPlayer
					this.eventHandlers?.updateRound!(data.round);
					this.eventHandlers?.updateTimer(data.duration);
                    break;
                case 'round_result':
					this.state.score = data.score;
					this.eventHandlers?.updateOverlayStatus(data.winner);
                    break;
				case 'countdown':
					this.state.currentRound = data.round;
					this.eventHandlers?.updateRound!(data.round);
					this.eventHandlers?.updateTimer(data.duration);
					break;
				case 'gameover':
					this.state.score = data.score
					this.eventHandlers?.updateOverlayStatus(data.winner);
					this.proxy.disconnect();
					break;
            }
        })
    }
	
	forfeit = () => {
		this.proxy.send(JSON.stringify({ type: 'forfeit' }));
	}

	markCell(cellNumber: number) {
		this.proxy.send(JSON.stringify({ type: 'move', sign: this.state.mySign, move: cellNumber}))
	}


}

export default RemoteXO;