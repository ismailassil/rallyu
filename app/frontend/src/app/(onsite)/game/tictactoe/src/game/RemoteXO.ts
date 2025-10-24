import { EventHandlers, XOState } from "@/app/(onsite)/game/types/types"
import SocketProxy from '@/app/(onsite)/game/utils/socketProxy'

class RemoteXO {
    NUM_PAD = {
		7: 0, 8: 1, 9: 2,
		4: 3, 5: 4, 6: 5,
		1: 6, 2: 7, 3: 8
	}
    state: XOState;
    status: string = 'idle';
    index: number | undefined;
    
    constructor(private proxy: SocketProxy, private eventHandlers?: EventHandlers) {
        this.index = undefined
        this.state = {
            cells: ['', '', '', '', '', '', '', '', ''],
			currentRound: 1,
			currentPlayer: '',
			mySign: '',
			score: [0, 0]
        };

        this.markCell = this.markCell.bind(this)
    }

    setupCommunications = () => {
        return this.proxy.subscribe((data: any): void => {
            switch (data.type) {
                case 'ready':
                    this.state.mySign = data.sign
                    this.index = data.index
                    this.eventHandlers?.updateSign!(data.sign);
                    break;
                case 'opp_left':
                    this.eventHandlers?.updateConnection!(true);
                    break;
                case 'opp_joined':
                    console.log('%cOPP_JOINED', ' font-color: red;')
                    this.eventHandlers?.updateConnection!(false);
                    break;
                case 'reconnected':
                    this.state.cells = data.cells
                    this.index = data.index
					this.state.mySign = data.sign;
                    this.state.score![0] = data.score[this.index!];
					this.state.score![1] = data.score[this.index! ^ 1];
					this.state.currentPlayer = data.currentPlayer;
					this.state.currentRound = data.currentRound;
                    this.eventHandlers?.updateSign!(data.sign);
                    this.eventHandlers?.updateCurrentPlayer!(data.currentPlayer);
                    this.eventHandlers?.updateBoard!(data.cells);
                    this.eventHandlers?.updateRound!(data.currentRound);
                    this.eventHandlers?.updateScore!(this.state.score!);
                    this.eventHandlers?.updateTimer(data.t);
                    break;
                case 'countdown':
					this.state.currentRound = data.round;
                    this.status = 'countdown';
                    this.eventHandlers?.updateOverlayStatus(this.status);
					this.eventHandlers?.updateRound!(data.round);
					this.eventHandlers?.updateTimer(prev => prev === data.duration ? prev - 1 : data.duration);
					break;
                case 'round_start':
                    this.state.cells.fill('');
                    this.state.currentRound = data.round;
                    this.state.currentPlayer = data.currentPlayer
                    this.status = this.state.currentPlayer === this.state.mySign ? 'play' : 'wait';
                    this.eventHandlers?.updateOverlayStatus(this.status);
                    this.eventHandlers?.updateCurrentPlayer!(data.currentPlayer);
                    this.eventHandlers?.updateRound!(data.round);
                    this.eventHandlers?.updateTimer(prev => prev === data.duration ? prev - 1 : data.duration);
                    break;
                case 'move':
                    this.state.cells[data.move] = data.sign;
                    this.state.currentPlayer = data.currentPlayer
                    this.status = this.state.currentPlayer === this.state.mySign ? 'play' : 'wait';
                    this.eventHandlers?.updateCurrentPlayer!(data.currentPlayer);
                    this.eventHandlers?.updateOverlayStatus(this.status);
                    this.eventHandlers?.updateBoard!(this.state.cells);
                    this.eventHandlers?.updateTimer(prev => prev === data.duration ? prev - 1 : data.duration);
                    break;
                case 'round_result':
					this.state.score![0] = data.score[this.index!];
					this.state.score![1] = data.score[this.index! ^ 1];
					this.eventHandlers?.updateScore!(this.state.score!);
                    break;
				case 'gameover':
                    this.status = 'gameover';
					this.state.score![0] = data.score[this.index!];
					this.state.score![1] = data.score[this.index! ^ 1];
					this.eventHandlers?.updateScore!(this.state.score!);
					this.eventHandlers?.updateOverlayStatus(this.status)
                    const displayedResult = data.winner === this.state.mySign ? 'win' : data.winner === 'draw' ? 'draw' : data.winner === 'X' ? `cross` : 'circle'
                    this.eventHandlers?.updateDisplayedResult!(displayedResult);
					this.eventHandlers?.updateTimer(0);
					this.proxy.disconnect();
					break;
            }
        })
    }

    private setupInputHandlers() {
        const handleKeyDown = (ev: KeyboardEvent) => {
			if (ev.key >= '1' && ev.key <= '9') {
				const key = Number(ev.key) as keyof typeof this.NUM_PAD;
				this.markCell(this.NUM_PAD[key]);
			}
		}

        window.addEventListener('keydown', handleKeyDown);
        return (() => {
            window.removeEventListener('keydown', handleKeyDown);
        })
    }

    init = () => {
        const disconnect = this.setupCommunications();
        const cleanupInput = this.setupInputHandlers();

        return () => {
            if(disconnect) disconnect();
            cleanupInput();
        }
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