import { EventHandlers, XOSign, XOState } from "@/app/(onsite)/game/types/types"
import SocketProxy from '@/app/(onsite)/game/utils/socketProxy'

class RemoteXO {
    state: XOState;
    status: string = 'idle';
    
    constructor(private proxy: SocketProxy, private eventHandlers?: EventHandlers) {
        this.state = {
            cells: ['', '', '', '', '', '', '', '', ''],
			currentRound: 1,
			currentPlayer: '',
			mySign: '',
			score: [0, 0]
        };

        this.markCell = this.markCell.bind(this)
    }

    setupCommunications = (): (() => void) => {
        console.log('Comms set up');
        return this.proxy.subscribe((data: any): void => {
            console.log("Data form tictactoe: ", data);
            switch (data.type) {
                case 'ready':
                    this.state.mySign = data.sign
                    break;
                case 'opp_left':
                    this.eventHandlers?.updateConnection!(true);
                    break;
                case 'opp_joined':
                    this.eventHandlers?.updateConnection!(false);
                    break;
                case 'reconnected':
                    this.state.cells = data.cells
					this.state.mySign = data.sign;
                    this.state.score = data.score;
					this.state.currentPlayer = data.currentPlayer;
					this.state.currentRound = data.currentRound;
                    this.eventHandlers?.updateBoard!(data.cells);
                    this.eventHandlers?.updateRound!(data.currentRound);
                    this.eventHandlers?.updateScore!(data.score);
                    // this.eventHandlers?.updateTimer!(data.t);
                    break;
                case 'countdown':
                    this.state.cells.fill('');
					this.state.currentRound = data.round;
                    this.status = 'countdown';
                    this.eventHandlers?.updateOverlayStatus(this.status);
					this.eventHandlers?.updateRound!(data.round);
					this.eventHandlers?.updateTimer(prev => prev === data.duration ? prev - 1 : data.duration);
					break;
                case 'round_start':
                    this.state.currentRound = data.round;
                    this.state.currentPlayer = data.currentPlayer
                    this.status = this.state.currentPlayer === this.state.mySign ? 'play' : 'wait';
                    this.eventHandlers?.updateOverlayStatus(this.status);
                    this.eventHandlers?.updateRound!(data.round);
                    this.eventHandlers?.updateTimer(prev => prev === data.duration ? prev - 1 : data.duration);
                    break;
                case 'move':
                    this.state.cells[data.move] = data.sign;
                    this.state.currentPlayer = data.currentPlayer
                    this.status = this.state.currentPlayer === this.state.mySign ? 'play' : 'wait';
                    this.eventHandlers?.updateOverlayStatus(this.status);
                    this.eventHandlers?.updateBoard!(this.state.cells);
                    this.eventHandlers?.updateTimer(prev => prev === data.duration ? prev - 1 : data.duration);
                    break;
                case 'round_result':
					this.state.score = data.score;
					this.eventHandlers?.updateScore!(data.score);
                    break;
				case 'gameover':
                    this.status = 'gameover';
					this.state.score = data.score
					this.eventHandlers?.updateScore!(data.score);
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
        if (this.status === 'play') {
		    this.proxy.send(JSON.stringify({ type: 'move', sign: this.state.mySign, move: cellNumber}))
        }
	}
}

export default RemoteXO;