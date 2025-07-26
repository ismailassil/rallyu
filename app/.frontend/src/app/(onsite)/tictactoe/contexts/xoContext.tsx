import {
	createContext,
	RefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

type XOContextTypes = {
	start: boolean;
	cells: string[];
	trigger: boolean;
	winner: string;
	timeLeft: number;
	showBanner: boolean;
	socketRef: RefObject<Socket | null>;
	gameIdRef: RefObject<string>;
	score: { pl1: number; pl2: number };
	round: number;
	currentPlayer: string;
	totalRounds: number;
	show: boolean;
	handleNextRound: () => void;
	handleMove: (index: number) => void;
	handleStart: () => void;
};

type plType = 'pl1' | 'pl2';

interface GameState {
	gameId: string;
	cells: string[];
	currentPlayer: plType;
	totalRounds: number;
	currentRound: number;
	score: { pl1: number; pl2: number };
}

const XOContext = createContext<XOContextTypes | undefined>(undefined);

export function useXO() {
	const context = useContext(XOContext);

	if (context === undefined) {
		throw new Error('useXO must be used within a XOProvider');
	}

	return context;
}

export function XOProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const [totalRounds, setTotalRounds] = useState<number>(5);
	const [start, setStart] = useState<boolean>(false);
	const [cells, setCells] = useState<string[]>(Array(9).fill(''));
	const [trigger, setTrigger] = useState<boolean>(false);
	const [winner, setWinner] = useState<string>('');
	const [currentPlayer, setCurrentPlayer] = useState<string>('');
	const [timeLeft, setTimeLeft] = useState<number>(0);
	const [score, setScore] = useState({ pl1: 0, pl2: 0 });
	const [showBanner, setShowBanner] = useState<boolean>(false);
	const [round, setRound] = useState(1);
	const socketRef = useRef<Socket | null>(null);
	const gameIdRef = useRef<string>('');
	const [show, setShow] = useState<boolean>(true);

	useEffect(() => {
		const socket = io('http://localhost:3457');

		socketRef.current = socket;

		socket.on('gameUpdate', (data) => {
			if (data.status === 'invalid_move') return;

			console.log(data);

			setCurrentPlayer(data.currentPlayer);
			if (data.cells) {
				setCells(data.cells);
			}
			if (data.status === 'going') return;

			setWinner(data.winner);
			setScore(data.states.score);
			setRound(data.states.currentRound);
			if (data.status === 'gameOver') {
				if (data.winner !== 'draw')
					setTrigger(true);
				setStart(false);
				setShow(true);
				return;
			}
			setShowBanner(true);
			setShow(true);
		});

		socket.on('timeLeft', ({ timeLeft }) => {
			console.log(timeLeft);
			setTimeLeft(timeLeft);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!start || !socketRef.current) return;

		const socket = socketRef.current;

		socket.emit('createGame', { plType: 'Player 1' }, (response: GameState) => {
			console.log('Game created with ID:', response.gameId);
			gameIdRef.current = response.gameId;
			setCurrentPlayer(response.currentPlayer);
			setTotalRounds(response.totalRounds);
			setCells(response.cells);
			setRound(response.currentRound);
			setScore(response.score);
		});
	}, [start]);

	function handleMove(index: number) {
		socketRef.current?.emit('play', { gameId: gameIdRef?.current, index });
	}

	function handleNextRound() {
		setShowBanner(false);
		setShow(false);
		socketRef.current?.emit(
			'nextRound',
			{ gameId: gameIdRef?.current },
			(response: {
				gameId: string;
				cells: string[];
				timeLeft: number;
				currentRound: number;
				currentPlayer: string;
			}) => {
				const { cells, timeLeft, currentRound, currentPlayer } = response;
				setCells(cells);
				setTimeLeft(timeLeft);
				setRound(currentRound);
				setCurrentPlayer(currentPlayer);
			},
		);
	}

	function handleStart() {
		setCells(Array(9).fill(''));
		setStart(true);
		setShow(false);
		setWinner('');
		setTrigger(false);
	}

	return (
		<XOContext.Provider
			value={{
				start,
				show,
				cells,
				trigger,
				winner,
				currentPlayer,
				timeLeft,
				socketRef,
				gameIdRef,
				showBanner,
				score,
				totalRounds,
				round,
				handleMove,
				handleNextRound,
				handleStart,
			}}
		>
			{children}
		</XOContext.Provider>
	);
}
