import { gameType } from './game.types';

class GameService {
	private cells: string[];
	private turn: string;
	private type: gameType;
	private timer!: NodeJS.Timeout;

	constructor(type = 'local' as gameType, turn) {
		this.cells = ['', '', '', '', '', '', '', '', ''];
		this.turn = turn;
		this.type = type;
	}
}

export default GameService;
